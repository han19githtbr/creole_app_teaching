# Gera src/lib/storyWindows.json: onde ficam as janelas (vidro) das cenas internas, para a camada de vida
# animar o que se vê lá fora (pássaros, pessoas passando, noite...). Uso: python3 scripts/ghibli/anchors/build-windows.py
import json, os, re, io, sys
import xml.etree.ElementTree as ET
import cairosvg, numpy as np
from PIL import Image
from scipy import ndimage
sys.path.insert(0, os.path.dirname(__file__))
import importlib.util
spec = importlib.util.spec_from_file_location('v', os.path.join(os.path.dirname(__file__), 'verify-anchors.py')); V = importlib.util.module_from_spec(spec); spec.loader.exec_module(V)
R = V.R
M = json.load(open(R + 'src/lib/storySceneMap.json'))
ET.register_namespace('', 'http://www.w3.org/2000/svg')
out = {
  # cenas base: o vidro foi medido na imagem (o céu já está desenhado nelas)
  'gastronomia': {'fy': 640, 'w': [{'r': [84, 104, 276, 300], 'p': 0, 'h': 0, 'o': []}]},
  'idiomas': {'fy': 600, 'w': [{'r': [64, 88, 268, 324], 'p': 0, 'h': 0, 'o': []}, {'r': [932, 88, 1138, 324], 'p': 0, 'h': 0, 'o': []}]},
}
for k in M:
    p = R + f'public/ghibli/{k}.svg'
    if 'wall windows' not in open(p).read(): continue
    root, defs, nodes = V.obj_nodes(p)
    parser = ET.XMLParser(target=ET.TreeBuilder(insert_comments=True)); r2 = ET.parse(p, parser=parser).getroot()
    node = None; pend = False
    for c in r2:
        if not isinstance(c.tag, str): pend = (c.text or '').strip() == 'wall windows'; continue
        if pend: node = c; break
    svg = ET.Element(r2.tag, dict(r2.attrib))
    for d in defs: svg.append(d)
    svg.append(ET.fromstring(re.sub(r'\sfilter="url\(#[^"]*\)"', '', ET.tostring(node, encoding='unicode'))))
    a = np.array(Image.open(io.BytesIO(cairosvg.svg2png(bytestring=ET.tostring(svg), output_width=600, output_height=400))).convert('RGBA'))[:, :, 3] > 40
    lab, n = ndimage.label(ndimage.binary_closing(a, iterations=2))
    wins = []
    for sl in ndimage.find_objects(lab):
        h = sl[0].stop - sl[0].start; w = sl[1].stop - sl[1].start
        if w * h < 400: continue
        x0, y0, x1, y1 = sl[1].start * 2 + 10, sl[0].start * 2 + 10, sl[1].stop * 2 - 10, sl[0].stop * 2 - 10
        occ = []
        for key, nn in nodes.items():
            m = V.mask(root, defs, nn)
            sub = m[int(y0 / 4):int(y1 / 4), int(x0 / 4):int(x1 / 4)]
            if sub.sum() > 6:
                ys, xs = np.nonzero(m)
                occ.append([max(x0, int(xs.min() * 4) - 4), max(y0, int(ys.min() * 4) - 4), min(x1, int(xs.max() * 4) + 4), min(y1, int(ys.max() * 4) + 4)])
        wins.append({'r': [x0, y0, x1, y1], 'p': 1, 'h': 1, 'o': occ})
    out[k] = {'fy': M[k]['gt'], 'w': wins}
json.dump(out, open(R + 'src/lib/storyWindows.json', 'w'), separators=(',', ':'))
print(len(out), 'cenas com janelas')
