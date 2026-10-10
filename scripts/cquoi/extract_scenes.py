#!/usr/bin/env python3
"""Extrai a cena (metade de cima) de cada imagem da pasta c-quoi, remove a seta
vermelha fixa (inpainting) e grava a posição da ponta da seta. No jogo a seta
é redesenhada por cima da cena e anima para a esquerda/direita.

Uso:  python3 scripts/cquoi/extract_scenes.py
Saída: public/c-quoi/scenes/<id>.jpg  e  scripts/cquoi/kitchen.json
"""
import json, glob, os
import numpy as np, cv2

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
SRC = os.path.join(ROOT, "public", "c-quoi")
OUT = os.path.join(SRC, "scenes")
os.makedirs(OUT, exist_ok=True)

# Imagem "pergunta" (com relógio) de cada objeto, na ordem de captura.
# A râpe só tem a imagem de pergunta; o nome foi completado com o mesmo padrão.
ITEMS = [
    ("presse-agrumes", "19.52.56", "Un presse-agrumes", "presse-agrumes"),
    ("rape",           "19.55.18", "Une râpe",          "râpe"),
    ("decapsuleur",    "19.56.09", "Un décapsuleur",    "décapsuleur"),
    ("entonnoir",      "19.57.50", "Un entonnoir",      "entonnoir"),
    ("spatule",        "19.59.23", "Une spatule",       "spatule"),
    ("fouet",          "20.01.52", "Un fouet",          "fouet"),
    ("presse-ail",     "20.03.31", "Un presse-ail",     "presse-ail"),
]

def find(stamp):
    return glob.glob(os.path.join(SRC, f"WhatsApp Image 2026-10-08 at {stamp}.jpeg"))[0]

out = []
for slug, stamp, fr, name in ITEMS:
    img = cv2.imread(find(stamp))
    h, w = img.shape[:2]
    # borda entre a cena (em cima) e o painel bege do boneco (embaixo)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(float)
    d = np.abs(np.diff(gray[300:420].mean(axis=1)))
    boundary = 300 + int(d.argmax())
    scene = img[:boundary].copy()
    b, g, r = scene[..., 0].astype(int), scene[..., 1].astype(int), scene[..., 2].astype(int)
    red = ((r > 200) & (g < 70) & (b < 70)).astype(np.uint8)
    # fica só com o maior componente vermelho (a seta), ignorando outros objetos avermelhados
    n, lab, stats, _ = cv2.connectedComponentsWithStats(red)
    biggest = 1 + int(stats[1:, cv2.CC_STAT_AREA].argmax())
    red = (lab == biggest).astype(np.uint8)
    ys, xs = np.nonzero(red)
    tip = (int(xs.max()) - 5, int(ys.max()) - 4)
    # a seta tem contorno branco: dilata a máscara para cobri-lo
    mask = cv2.dilate(red * 255, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (17, 17)))
    clean = cv2.inpaint(scene, mask, 6, cv2.INPAINT_TELEA)
    cv2.imwrite(os.path.join(OUT, f"{slug}.jpg"), clean, [cv2.IMWRITE_JPEG_QUALITY, 90])
    out.append({"id": slug, "fr": fr, "name": name, "scene": f"/c-quoi/scenes/{slug}.jpg",
                "w": w, "h": boundary, "arrow": {"x": tip[0], "y": tip[1]}})
    print(slug, (w, boundary), tip)

json.dump(out, open(os.path.join(os.path.dirname(__file__), "kitchen.json"), "w"), ensure_ascii=False, indent=1)
