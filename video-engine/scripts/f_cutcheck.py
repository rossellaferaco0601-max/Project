#!/usr/bin/env python3
"""Controllo degli stacchi di un master fatto con cn_master_shots.py: ogni bordo tra inquadrature (da <master>_pezzi.json) deve cadere
esattamente sul fotogramma previsto (nessun fotogramma dell'inquadratura vicina prima o dopo). Uso: python3 scripts/f_cutcheck.py public/x/master.mp4"""
import json, subprocess, sys, numpy as np
m = sys.argv[1]; pz = json.load(open(m.replace(".mp4", "_pezzi.json")))
r = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", m, "-vf", "scale=96:170", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
fr = np.frombuffer(r, np.uint8).reshape(-1, 96 * 170).astype(np.int16); d = np.r_[0, np.abs(fr[1:] - fr[:-1]).mean(axis=1)]
bad = 0
for p in pz[1:]:
    f = round(p["master"][0] * 30); lo, hi = max(1, f - 3), min(len(d) - 1, f + 3); k = lo + int(np.argmax(d[lo:hi + 1]))
    near = np.median(np.r_[d[max(1, f - 12):f - 3], d[f + 4:f + 13]])
    if k != f and d[k] > 3 * max(near, 0.5): bad += 1; print(f"  ✗ stacco previsto al fotogramma {f} ({f / 30:.2f} s), trovato a {k}")
print(f"{m.split('/')[-1]}: {len(pz) - 1} stacchi, {'✗ ' + str(bad) + ' fuori posto' if bad else 'tutti al fotogramma giusto'}, {len(d)} fotogrammi"); sys.exit(1 if bad else 0)
