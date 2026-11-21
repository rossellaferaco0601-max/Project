#!/usr/bin/env python3
"""Ritagli per i reel «a finestra» (circuito in casa di YTCN 26): per ogni inquadratura del reel trova dove sta Daniele (vestito di nero in una
stanza chiara: la macchia scura più grande, unita su tutti i fotogrammi campionati) e sceglie il ritaglio di proporzione 1080:h più stretto
che lo contiene tutto con un po' d'aria (mai più stretto di MINW px del sorgente). Scrive `crops` in work/ytcn26/<id>_extra.json.
Uso: ../.claude/skills/effects/.venv/bin/python scripts/g_wincrops.py work/ytcn26/G5-climber.json [altezza finestra=800]"""
import json, os, subprocess, sys
import numpy as np, cv2
cfg = json.load(open(sys.argv[1])); WH = int(sys.argv[2]) if len(sys.argv) > 2 else 800
SW, SH = cfg.get("srcSize", [1920, 1080]); A = 1080 / WH; MINW = 1000
shots = json.load(open(cfg["shots"])); crops = {}
for seg in cfg["segments"]:
    for sh in shots:
        a, b = max(seg["from"], sh["from"]), min(seg["to"], sh["to"])
        if b - a < 0.08: continue
        box = None
        for t in np.arange(a + 0.05, b, max(0.25, (b - a) / 24)):
            raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-ss", f"{t:.3f}", "-i", cfg["src"], "-frames:v", "1", "-vf", "scale=480:270", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
            if len(raw) < 480 * 270: continue
            g = np.frombuffer(raw, np.uint8).reshape(270, 480)
            m = cv2.morphologyEx((g < 52).astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
            n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
            if n < 2: continue
            k = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
            if st[k, cv2.CC_STAT_AREA] < 500: continue
            x0, y0, w, h = st[k, 0] * 4, st[k, 1] * 4, st[k, 2] * 4, st[k, 3] * 4
            box = [x0, y0, x0 + w, y0 + h] if box is None else [min(box[0], x0), min(box[1], y0), max(box[2], x0 + w), max(box[3], y0 + h)]
        if box is None: cw = min(SW, SH * A); crops[f"{sh['from']:.2f}"] = [round((SW - cw) / 2), 0, round(cw), round(cw / A)]; print(f"{sh['from']:.2f} nessuna figura: centro"); continue
        bw, bh = box[2] - box[0], box[3] - box[1]
        cw = min(min(SW, SH * A), max(MINW, bw * 1.16 + 60, (bh * 1.12 + 110) * A)); ch = cw / A
        cx, cy = (box[0] + box[2]) / 2, (box[1] + box[3]) / 2 - 0.04 * ch   # un po' più di aria sopra la testa che sotto i piedi
        x = min(max(0, cx - cw / 2), SW - cw); y = min(max(0, cy - ch / 2), SH - ch)
        crops[f"{sh['from']:.2f}"] = [int(x) // 2 * 2, int(y) // 2 * 2, int(cw) // 2 * 2, int(ch) // 2 * 2]
        print(f"{sh['from']:.2f} ({a:.1f}-{b:.1f}) figura {box} → ritaglio {crops[f'{sh['from']:.2f}']}")
path = sys.argv[1].replace(".json", "_extra.json"); ex = json.load(open(path)) if os.path.exists(path) else {}
ex["crops"] = crops; json.dump(ex, open(path, "w"), indent=1); print("scritto", path)
