#!/usr/bin/env python3
"""Controlli finali su un reel finito della serie F: fotogrammi neri, audio nella CTA (deve restare muto salvo il clic), durata.
Uso: python3 scripts/f_qa.py out/ytcn22/consegna/F2-ciclista_v1.mp4 [secondi di CTA=8]"""
import subprocess, sys, numpy as np
f = sys.argv[1]; cta = float(sys.argv[2]) if len(sys.argv) > 2 else 8.0
d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
bl = subprocess.run(["ffmpeg", "-loglevel", "info", "-i", f, "-vf", "blackdetect=d=0.03:pix_th=0.08", "-an", "-f", "null", "-"], capture_output=True, text=True).stderr.count("black_start")
r = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
x = np.frombuffer(r, np.int16).astype(np.float32) / 32768
t0 = d - cta; loud = []
for a in np.arange(t0 + 0.3, d - 0.25, 0.25):
    s = x[int(a * 16000):int((a + 0.25) * 16000)]; db = 20 * np.log10(np.sqrt((s ** 2).mean()) + 1e-9)
    if db > -45 and not (t0 + 3.9 < a < t0 + 5.0): loud.append((round(float(a - t0), 2), round(float(db))))
last = x[int((t0 - 1.2) * 16000):int(t0 * 16000)]
print(f"{f.split('/')[-1]}: durata {d:.2f} s, fotogrammi neri {bl}, audio nella CTA fuori dal clic: {loud or 'nessuno'}, ultimo secondo di parlato {20 * np.log10(np.sqrt((last ** 2).mean()) + 1e-9):.0f} dB")
sys.exit(1 if bl or loud else 0)
