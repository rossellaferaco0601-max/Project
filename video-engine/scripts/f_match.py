#!/usr/bin/env python3
"""Stacco fluido tra due inquadrature dello stesso punto di vista (salto da larga a stretta): calcola l'avvicinamento lento (`push`)
che porta il volto dell'inquadratura A alla stessa grandezza e posizione che ha all'inizio dell'inquadratura B, e segna lo stacco come
morbido (`soft`). Scrive/aggiorna work/ytcn22/<id>_extra.json (letto da scripts/f_cfg.ts).
Uso: python3 scripts/f_match.py F1-normale 199.2 [altri inizi di B ...]     (il tempo è l'inizio di B nel sorgente, ±0,1 s)"""
import json, os, statistics, sys
rid, times = sys.argv[1], [float(v) for v in sys.argv[2:]]
shots = json.load(open("work/ytcn22_shots.json")); raw = json.load(open("work/shots/ytcn22_src.json")); F = raw["faces"]; SW, SH = raw["size"]
MINH = 1250 * SH / 2160
def crop_of(f):
    ch = min(SH, max(MINH, f[3] * SH / 0.25)); ch = max(MINH, min(ch, (SH - f[1] * SH) / 0.9)); cw = ch * 9 / 16
    return [min(max(0, (f[0] + f[2] / 2) * SW - cw / 2), SW - cw), min(max(0, f[1] * SH - 0.10 * ch), SH - ch), cw, ch]
def med(i0, i1):
    fs = [f for f in F[i0:i1] if f]; return [statistics.median(x[i] for x in fs) for i in range(4)]
path = f"work/ytcn22/{rid}_extra.json"; ex = json.load(open(path)) if os.path.exists(path) else {}
ex.setdefault("push", {}); ex.setdefault("soft", [])
for t in times:
    j = min(range(len(shots)), key=lambda i: abs(shots[i]["from"] - t)); A, B = shots[j - 1], shots[j]
    cb = crop_of(B["face"]); i = round(B["from"] * 30)
    fb, fa = med(i + 1, i + 7), med(i - 7, i - 1)          # volto all'inizio di B e alla fine di A (pixel del sorgente)
    # posizione del volto di B nel fotogramma finale (frazioni): centro x, bordo alto, altezza
    ux, uy, uh = (fb[0] + fb[2] / 2 - cb[0]) / cb[2], (fb[1] - cb[1]) / cb[3], fb[3] / cb[3]
    ch = fa[3] / uh; cw = ch * 9 / 16
    tgt = [min(max(0, fa[0] + fa[2] / 2 - ux * cw), SW - cw), min(max(0, fa[1] - uy * ch), SH - ch), cw, ch]
    ca = crop_of(A["face"])
    ex["push"][f"{A['from']:.2f}"] = [round(v, 1) for v in tgt]
    if not any(abs(s - B["from"]) < 0.02 for s in ex["soft"]): ex["soft"].append(B["from"])
    print(f"{rid}: A {A['from']:.2f}-{A['to']:.2f} ritaglio {[round(v) for v in ca]} → {[round(v) for v in tgt]} (ingrandimento finale {1920 / ch:.2f}×), stacco morbido a {B['from']:.2f}")
json.dump(ex, open(path, "w"), indent=1)
