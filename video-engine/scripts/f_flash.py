#!/usr/bin/env python3
"""Lampi di un solo fotogramma: un fotogramma diverso da quello prima e da quello dopo, mentre quelli due sono quasi uguali tra loro
(= un fotogramma dell'inquadratura successiva finito in coda a un pezzo: «la mossa successiva di Daniele» prima della CTA o di uno stacco).
Va lanciato sul master e sul file finale di OGNI reel prima della consegna.
Uso: python3 scripts/f_flash.py file.mp4 [altri ...]      esce con 1 se trova un lampo"""
import subprocess, sys, numpy as np
bad = 0
for m in sys.argv[1:]:
    r = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", m, "-vf", "scale=96:170", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
    fr = np.frombuffer(r, np.uint8).reshape(-1, 96 * 170).astype(np.int16)
    a = np.abs(fr[1:-1] - fr[:-2]).mean(axis=1); b = np.abs(fr[2:] - fr[1:-1]).mean(axis=1); c = np.abs(fr[2:] - fr[:-2]).mean(axis=1)
    hit = [i + 1 for i in range(len(a)) if a[i] > 12 and b[i] > 12 and c[i] < 0.35 * min(a[i], b[i])]
    bad += len(hit)
    print(f"{m.split('/')[-1]}: " + (("✗ LAMPO al fotogramma " + ", ".join(f"{i} ({i / 30:.2f} s)" for i in hit)) if hit else f"✓ nessun lampo ({len(fr)} fotogrammi)"))
sys.exit(1 if bad else 0)
