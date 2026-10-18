import fs from 'fs';
import { Resvg } from '@resvg/resvg-js';
import { splitTop } from './split.mjs';
import path from 'path';import {fileURLToPath} from 'url';
const here=path.dirname(fileURLToPath(import.meta.url));
const dir=path.resolve(here,'../../../public/ghibli');
const SC=0.25, W=300,H=200;
function maskB64(r,thr){const GW=150,GH=100;const bits=new Uint8Array(GW*GH/8);for(let gy=0;gy<GH;gy++)for(let gx=0;gx<GW;gx++){let on=0;for(let dy=0;dy<2&&!on;dy++)for(let dx=0;dx<2;dx++){const x=gx*2+dx,y=gy*2+dy;if(r.px[(y*r.w+x)*4+3]>thr){on=1;break;}}if(on){const i=gy*GW+gx;bits[i>>3]|=1<<(i&7);}}return Buffer.from(bits).toString('base64');}
function renderMask(openTag, defs, markup){
  const m=markup.replace(/\sfilter="url\(#(dropShadow|softGlow)\)"/g,'');
  const svg=`${openTag}${defs}${m}</svg>`;
  try{
    const img=new Resvg(svg,{fitTo:{mode:'width',value:W},background:'rgba(0,0,0,0)',font:{loadSystemFonts:false}}).render();
    return {px:img.pixels,w:img.width,h:img.height};
  }catch(e){return null;}
}
function bboxOf(r){
  if(!r) return null; let x0=1e9,y0=1e9,x1=-1,y1=-1,cnt=0;
  for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++){ if(r.px[(y*r.w+x)*4+3]>60){cnt++;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;} }
  if(cnt===0) return null;
  const k=1200/r.w; return {x0:x0*k,y0:y0*k,x1:(x1+1)*k,y1:(y1+1)*k,area:cnt/(r.w*r.h)};
}
const SHARD=+process.argv[2],NSH=+process.argv[3];
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.svg')).sort().filter((_,i)=>i%NSH===SHARD);
const out={};
for(const f of files){
  const svg=fs.readFileSync(`${dir}/${f}`,'utf8');
  const {openTag,nodes}=splitTop(svg);
  const defsNode=nodes.find(n=>n.tag==='defs');
  const defs=defsNode?defsNode.markup:'';
  const res=[];
  nodes.forEach((n,i)=>{
    if(['defs','title','desc','style'].includes(n.tag)) return;
    if(n.tag==='rect'&&/width="1200"/.test(n.attrs||'')){res.push({i,tag:n.tag,attrs:(n.attrs||'').slice(0,90),comment:n.comment||null,inner:[],bb:{x0:0,y0:0,x1:1200,y1:800,area:1}});return;}
    const r=renderMask(openTag,defs,n.markup); const bb=bboxOf(r);
    const inner=[...n.markup.matchAll(/<!--([\s\S]*?)-->/g)].map(m=>m[1].trim()).slice(0,30);
    res.push({i,tag:n.tag,attrs:(n.attrs||'').slice(0,90),comment:n.comment||null,inner,bb,m:r?maskB64(r,60):null,mo:r?maskB64(r,200):null});
  });
  out[f.replace('.svg','')]={ok:res.length,nodes:res};
}
fs.writeFileSync(path.join(here,'nodes.json'),JSON.stringify(out));
console.log('done',Object.keys(out).length);
