/**
 * Melhoria em tempo real da imagem da câmera para o estúdio de gravação:
 *  - nitidez (máscara de nitidez só na luminância, com limiar para não realçar o ruído da webcam);
 *  - exposição automática centrada no rosto (levanta sombras quando a imagem está escura, sem estourar o fundo claro);
 *  - leve ajuste de saturação.
 * Roda numa GPU (WebGL) por quadro; se o navegador não oferecer WebGL, devolve o próprio <video> (sem melhoria).
 * O resultado é um canvas com a resolução da câmera (limitada a 1920 px de largura) que o estúdio usa no lugar do vídeo cru,
 * então a melhoria vale para a prévia, para o vídeo gravado, para o download e para o que for publicado.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform float uAmount;
uniform float uGamma;
uniform float uGain;
uniform float uSat;
varying vec2 vUv;

void main() {
  vec3 c = texture2D(uTex, vUv).rgb;
  vec2 tx = vec2(uTexel.x, 0.0);
  vec2 ty = vec2(0.0, uTexel.y);
  // desfoque gaussiano 3x3 (referência da máscara de nitidez)
  vec3 b = c * 0.25;
  b += (texture2D(uTex, vUv + tx).rgb + texture2D(uTex, vUv - tx).rgb + texture2D(uTex, vUv + ty).rgb + texture2D(uTex, vUv - ty).rgb) * 0.125;
  b += (texture2D(uTex, vUv + tx + ty).rgb + texture2D(uTex, vUv - tx + ty).rgb + texture2D(uTex, vUv + tx - ty).rgb + texture2D(uTex, vUv - tx - ty).rgb) * 0.0625;
  float dl = dot(c - b, vec3(0.299, 0.587, 0.114));
  // só realça detalhe de verdade (olhos, cabelo, contorno); diferenças minúsculas são ruído
  float k = smoothstep(0.010, 0.045, abs(dl));
  float boost = clamp(dl * uAmount * k, -0.10, 0.10);
  vec3 s = c + vec3(boost);
  // exposição: ganho + gama (<1 clareia as sombras)
  s = pow(clamp(s * uGain, 0.0, 1.0), vec3(uGamma));
  float l = dot(s, vec3(0.299, 0.587, 0.114));
  s = mix(vec3(l), s, uSat);
  gl_FragColor = vec4(clamp(s, 0.0, 1.0), 1.0);
}`;

export interface FaceEnhancerOptions {
  /** força da nitidez (0 = desligada). Padrão 1.1 */
  sharpness?: number;
  /** luminância alvo do rosto (0..1). Padrão 0.42 */
  targetLuma?: number;
}

export class FaceEnhancer {
  readonly canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private tex: WebGLTexture | null = null;
  private uTexel: WebGLUniformLocation | null = null;
  private uAmount: WebGLUniformLocation | null = null;
  private uGamma: WebGLUniformLocation | null = null;
  private uGain: WebGLUniformLocation | null = null;
  private uSat: WebGLUniformLocation | null = null;
  private meter: HTMLCanvasElement;
  private meterCtx: CanvasRenderingContext2D | null;
  private lastMeter = 0;
  private gamma = 1;
  private lost = false;
  sharpness: number;
  targetLuma: number;
  /** true quando o WebGL está funcionando */
  get active(): boolean { return !!this.gl && !this.lost; }
  /** gama atual (para depuração/exibição) */
  get currentGamma(): number { return this.gamma; }

  constructor(opts: FaceEnhancerOptions = {}) {
    this.sharpness = opts.sharpness ?? 1.1;
    this.targetLuma = opts.targetLuma ?? 0.42;
    this.canvas = document.createElement("canvas");
    this.canvas.width = 16;
    this.canvas.height = 9;
    this.meter = document.createElement("canvas");
    this.meter.width = 32;
    this.meter.height = 18;
    this.meterCtx = this.meter.getContext("2d", { willReadFrequently: true });
    try {
      const gl = this.canvas.getContext("webgl", { premultipliedAlpha: false, preserveDrawingBuffer: true, antialias: false }) as WebGLRenderingContext | null;
      if (!gl) return;
      const prog = this.buildProgram(gl);
      if (!prog) return;
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "aPos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      this.tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      this.uTexel = gl.getUniformLocation(prog, "uTexel");
      this.uAmount = gl.getUniformLocation(prog, "uAmount");
      this.uGamma = gl.getUniformLocation(prog, "uGamma");
      this.uGain = gl.getUniformLocation(prog, "uGain");
      this.uSat = gl.getUniformLocation(prog, "uSat");
      this.canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); this.lost = true; });
      this.gl = gl;
    } catch {
      this.gl = null;
    }
  }

  private buildProgram(gl: WebGLRenderingContext): WebGLProgram | null {
    const mk = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
    };
    const v = mk(gl.VERTEX_SHADER, VERT), f = mk(gl.FRAGMENT_SHADER, FRAG);
    if (!v || !f) return null;
    const p = gl.createProgram();
    if (!p) return null;
    gl.attachShader(p, v);
    gl.attachShader(p, f);
    gl.linkProgram(p);
    return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
  }

  /** mede a luminância da região do rosto (centro do quadro) ~2x por segundo e ajusta o gama devagar, sem "pulsar" */
  private measure(video: HTMLVideoElement, now: number) {
    if (!this.meterCtx || now - this.lastMeter < 450) return;
    this.lastMeter = now;
    try {
      this.meterCtx.drawImage(video, 0, 0, 32, 18);
      const d = this.meterCtx.getImageData(0, 0, 32, 18).data;
      let sum = 0, wsum = 0;
      for (let y = 0; y < 18; y++) for (let x = 0; x < 32; x++) {
        const cx = Math.abs(x - 15.5) / 16, cy = Math.abs(y - 8.5) / 9;
        const w = cx < 0.5 && cy < 0.75 ? 1 : 0.15; // o centro (rosto) pesa mais que as bordas
        const i = (y * 32 + x) * 4;
        sum += w * (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
        wsum += w;
      }
      const mean = Math.min(0.95, Math.max(0.04, sum / wsum));
      // abaixo do alvo: clareia (gama < 1). Acima: não escurece.
      const wanted = mean < this.targetLuma ? Math.min(1, Math.max(0.55, Math.log(this.targetLuma) / Math.log(mean))) : 1;
      this.gamma += (wanted - this.gamma) * 0.2;
    } catch { /* getImageData pode falhar em casos raros; segue sem medir */ }
  }

  /** Devolve a imagem melhorada (canvas) ou o próprio vídeo se o WebGL não estiver disponível. */
  process(video: HTMLVideoElement): CanvasImageSource {
    const gl = this.gl;
    const vw = video.videoWidth, vh = video.videoHeight;
    if (!gl || this.lost || !this.tex || !vw || !vh || video.readyState < 2) return video;
    const k = Math.min(1, 1920 / vw);
    const w = Math.round(vw * k), h = Math.round(vh * k);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.measure(video, performance.now());
    try {
      gl.viewport(0, 0, w, h);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      gl.uniform2f(this.uTexel, 1 / vw, 1 / vh);
      gl.uniform1f(this.uAmount, this.sharpness * 1.6);
      gl.uniform1f(this.uGamma, this.gamma);
      gl.uniform1f(this.uGain, 1.0);
      gl.uniform1f(this.uSat, 1.06);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      return this.canvas;
    } catch {
      return video;
    }
  }
}

/** tamanho (px) de uma fonte de imagem: vídeo, canvas ou bitmap */
export function sourceSize(src: CanvasImageSource, fallbackW: number, fallbackH: number): { vw: number; vh: number } {
  const s = src as Partial<HTMLVideoElement & HTMLCanvasElement & ImageBitmap>;
  const vw = s.videoWidth || s.width || fallbackW;
  const vh = s.videoHeight || s.height || fallbackH;
  return { vw: Number(vw) || fallbackW, vh: Number(vh) || fallbackH };
}
