import json,subprocess,sys
ws=json.load(open('src/cn/words22.json'))
P={ # reel: pezzi (inizio≈, fine≈) dai tempi della trascrizione
'F2':[(74.0,110.3)],
'F3':[(0.0,22.7),(110.4,118.3),(126.5,138.95)],
'F4':[(200.9,210.0),(221.2,240.1),(240.2,245.3),(289.5,294.75),(349.4,354.85),(397.4,402.75),(441.9,451.85)],
'F5':[(245.3,287.5)],
'F6':[(294.75,322.4)],
'F7':[(354.85,395.9)],
'F8':[(402.75,441.85)],
'F9':[(451.85,472.85),(479.2,494.65)],
'F10':[(501.2,524.95),(527.2,549.9)],
'F11':[(139.1,178.85)],
'F12':[(554.8,598.85)],
'F13':[(639.7,643.65),(664.4,710.15)],
'F14':[(598.85,639.65)],
'F15':[(710.1,751.2)],
}
for r,ps in P.items():
    q=[]
    for a,b in ps:
        inn=[w for w in ws if w['startMs']/1000>=a-0.3 and w['endMs']/1000<=b+0.3]
        q.append((inn[0]['startMs']/1000,inn[-1]['endMs']/1000))
        print(r,f"{inn[0]['startMs']/1000:.2f}-{inn[-1]['endMs']/1000:.2f}",' '.join(w['text'].strip() for w in inn[:5]),'…',' '.join(w['text'].strip() for w in inn[-4:]))
    out=subprocess.run(['python3','scripts/cn_quiet.py','work/ytcn22/src16k.wav',','.join(f"{a:.2f}-{b:.2f}" for a,b in q)],capture_output=True,text=True).stdout
    print('   ',out.strip().replace('\n','\n    '))
