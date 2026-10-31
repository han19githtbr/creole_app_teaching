# Uso: pip install cairosvg pillow numpy && python3 scripts/ghibli/anchors/verify-anchors.py [--fix]
"""Verifica (e opcionalmente corrige) as âncoras de rótulo das cenas variantes.
Para cada cena -NN: renderiza cada objeto (<!-- obj chave -->) isolado e confere se a âncora i
cai dentro do objeto i (objects[i] em imageSceneVariants.json)."""
import json, re, sys, io
import xml.etree.ElementTree as ET
import cairosvg
from PIL import Image
import numpy as np

import os
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')) + '/'
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS); ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')
THEME_IDS = ['tecnologia','natureza','cultura','turismo','interior','danca','geografia','historia','cinema','musica','lazeres','estoicismo','religiao','gastronomia','idiomas']
V = json.load(open(R+'src/lib/imageSceneVariants.json'))
A = json.load(open(R+'src/lib/storyElementAnchors.json'))
D = json.load(open(R+'src/lib/themeElementDetails.json'))
W, H = 300, 200

def norm(k): return re.sub(r'[^a-z0-9]', '', re.sub(r'[^\x00-\x7f]', '', k).lower())

def obj_nodes(path):
    parser = ET.XMLParser(target=ET.TreeBuilder(insert_comments=True))
    root = ET.parse(path, parser=parser).getroot()
    defs = [c for c in root if isinstance(c.tag, str) and c.tag.endswith('defs')]
    out, pending = {}, None
    for c in root:
        if not isinstance(c.tag, str):  # comentário
            m = re.match(r'\s*obj\s+(.+?)\s*$', c.text or '')
            pending = m.group(1) if m else None
            continue
        if pending:
            out.setdefault(norm(pending), []).append(c); pending = None
    return root, defs, out

def mask(root, defs, nodes):
    svg = ET.Element(root.tag, {k: v for k, v in root.attrib.items()})
    for d in defs: svg.append(d)
    for n in nodes:
        s = ET.tostring(n, encoding='unicode')
        s = re.sub(r'\sfilter="url\(#[^"]*\)"', '', s)
        svg.append(ET.fromstring(s))
    png = cairosvg.svg2png(bytestring=ET.tostring(svg), output_width=W, output_height=H)
    a = np.array(Image.open(io.BytesIO(png)).convert('RGBA'))[:, :, 3]
    return a > 40

def point_in(m, x, y, tol=2):
    px, py = int(x / 100 * W), int(y / 100 * H)
    return bool(m[max(0, py-tol):py+tol+1, max(0, px-tol):px+tol+1].any())

def best_point(m):
    ys, xs = np.nonzero(m)
    if len(xs) == 0: return None
    cx, cy = xs.mean(), ys.mean()
    if not m[int(cy), int(cx)]:  # centro fora do desenho (objeto vazado): pega o pixel mais próximo
        i = np.argmin((xs-cx)**2 + (ys-cy)**2); cx, cy = xs[i], ys[i]
    return round(cx / W * 100, 1), round(cy / H * 100, 1)

if __name__ == '__main__':
    fix = '--fix' in sys.argv
    stats = dict(ok=0, bad=0, swapped=0, missing=0)
    report = []
    for ti, tid in enumerate(THEME_IDS):
        theme = list(V)[ti]
        for v in range(2, 21):
            sid = f'{tid}-{v:02d}'
            raw = V[theme]['scenes'][v-2]['objects']
            objs = [norm((D.get(theme, {}).get(o) or {}).get('kreyol') or V[theme]['labels'].get(o) or o) for o in raw]
            root, defs, nodes = obj_nodes(f'{R}public/ghibli/{sid}.svg')
            masks = {k: mask(root, defs, n) for k, n in nodes.items()}
            anchors = A[sid]
            for i, key in enumerate(objs):
                if key not in masks:
                    stats['missing'] += 1; report.append((sid, i, key, 'sem nó obj no SVG')); continue
                if i >= len(anchors) or anchors[i] is None: continue
                x, y = anchors[i]
                if point_in(masks[key], x, y): stats['ok'] += 1; continue
                other = [k for k in objs if k != key and k in masks and point_in(masks[k], x, y)]
                stats['bad'] += 1
                if other: stats['swapped'] += 1
                new = best_point(masks[key])
                report.append((sid, i, key, f'âncora ({x},{y}) fora; cai em {other or "nenhum objeto"}; correto≈{new}'))
                if fix and new: anchors[i] = list(new)
    print(stats)
    for r in report[:60]: print(r)
    json.dump(report, open('/tmp/anchors-report.json', 'w'), ensure_ascii=False, indent=1)
    if fix: json.dump(A, open(R+'src/lib/storyElementAnchors.json', 'w'), separators=(',', ':')); print('anchors atualizadas')
