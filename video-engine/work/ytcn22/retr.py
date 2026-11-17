import sys, subprocess
from faster_whisper import WhisperModel
m = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8')
for rid in sys.argv[1:]:
    wav = f'work/ytcn22/{rid}_m.wav'
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f'public/ytcn22/masters/{rid}.mp4','-ac','1','-ar','16000',wav],check=True)
    segs,_ = m.transcribe(wav, language='it', vad_filter=True)
    print(f'## {rid}:', ' '.join(s.text.strip() for s in segs), flush=True)
