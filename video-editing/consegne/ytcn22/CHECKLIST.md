# Checklist di consegna · YTCN 22, serie F (17/11/2026, correzioni del 18/11)

File in `video-engine/out/ytcn22/consegna/`: per ogni reel `ID_vN.mp4` (1080×1920, 30 fps), `ID_vN.jpg` e `ID_copertina.jpg` (copertina nel formato unico), `ID_didascalia.txt`, `ID_vN_anteprima.mp4`. Tavola delle copertine: `video-engine/out/ytcn22/F_copertine.jpg`.

| Reel | Durata (video + CTA) | Grafiche | Parola da commentare |
|---|---|---|---|
| F1-normale v2 | 54.4 + 8 s | apertura con lettere che cadono, frasi fatte barrate, parola che piomba, frase a lato nel primissimo piano | BASTA |
| F2-ciclista v1 | 37.1 + 8 s | scheda domanda, due timbri sul giudizio (ciclista / chi corre) | BICI |
| F3-fastidi v1 | 43.8 + 8 s | scheda in alto con il video ridotto, titolo, pillole che si accumulano | FASTIDI |
| F4-prezzi v2 | 59.3 + 8 s | parole in apertura, scontrino che stampa i cinque prezzi, conto intero a tutto schermo fino alla CTA | PREZZO |
| F5-liberta v1 | 41.9 + 8 s | titolo, interruttori che si spengono, messaggi dei ruoli | LIBERO |
| F6-valvola v1 | 28.2 + 8 s | parola che piomba, elenco a scorrimento 1/3, pressione che sale | SFOGO |
| F7-declino v2 | 41.7 + 8 s | lettere che cadono, livelli che si svuotano e che si riempiono | FORMA |
| F8-zero v1 | 39.7 + 8 s | barra dei progressi che si azzera, spie di allarme | PROGRESSI |
| F9-ciclo v1 | 37.1 + 8 s | domanda in apertura, ciclo in quattro tappe che si richiude | CICLO |
| F10-investimento v1 | 47.0 + 8 s | titolo nella fascia bassa (primo piano), dato, scheda in tre punti, muro di parole | INVESTO |
| F11-trentamila v2 | 39.9 + 8 s | dato «12 anni», contatore +30.000, frase barrata | BENEFICI |
| F12-metodo v1 | 44.5 + 8 s | cartellino con il nome, percorso a tre tappe | METODO |
| F13-sostenibile v2 | 50.5 + 8 s | lettere che cadono, bilancia che dondola fino a «a che prezzo?», pillole dei risultati | SOSTENIBILE |
| F14-consapevole v2 | 41.6 + 8 s | domanda in apertura, corpo e mente, quattro caselle, «la maggioranza non lo fa», rischio che sale, voci barrate | CONSAPEVOLE |
| F15-rispetto v1 | 38.9 + 8 s | titolo, parola che piomba «Mi rispetto», elenco con le spunte | RISPETTO |

- ✓ Tagli: ogni punto di taglio in un silenzio misurato sull'audio; master ritrascritti (frasi intere, nessuna parola mozzata o doppia) e ritrascrizione dei file finali.
- ✓ Stacchi: tutti gli stacchi del video di partenza cadono sul fotogramma giusto (`f_cutcheck.py`); nessun fotogramma nero; audio in sincrono (scarto 0 ms).
- ✓ Finale: negli ultimi secondi nessun salto di inquadratura (F1, F4, F5, F15: avvicinamento lento + dissolvenza di 5 fotogrammi); la CTA sale dal basso in 9 fotogrammi; in F10 il muro di parole resta finché la CTA lo copre.
- ✓ Volto sempre libero: controllo automatico grafica per grafica e sui sottotitoli (`f_facecheck.ts`), più fogli di fotogrammi guardati a grandezza reale.
- ✓ Sottotitoli sempre presenti (spenti solo durante l'apertura e quando una scritta occupa la fascia bassa nei primi piani), in lime solo la parola detta; grafiche a più di 40 px dai sottotitoli e sopra lo 0,80 dell'altezza.
- ✓ Animazioni diverse in ogni reel (colonna «Grafiche»); niente logo nei reel, niente musica, niente emoji; CTA in tre passi da 8 s con «coaching personalizzato di Correre Naturale®»; nella CTA solo il clic.
- ✓ Volume: da −14,1 a −15,1 LUFS, picco −2,3 dBTP.
- ✓ Copertine nel formato unico (occhiello «Infortuni nella corsa», Daniele che sorride, logo); didascalie con tema, approfondimento, conclusione, CTA con la parola, pochi hashtag.
- ⚠ Sorgente Full HD (non 4K): nel verticale l'immagine è ingrandita di circa 1,8 volte (fino a 2,4 nell'avvicinamento finale di F1). Con l'originale 4K i reel si possono rifare più nitidi senza cambiare altro.
- ⚠ Non usato: 5:22–5:49 del video (guida gratuita con «link in descrizione»). In F5 Daniele dice «portare a spasso il cane»: nell'interruttore è scritto «Uscire col cane» per stare nella riga.
- ⚠ In F1 e F4 per alcuni secondi il video si ritira a sinistra (frase o elenco a destra): in F1 perché nel primissimo piano il mento arriverebbe sui sottotitoli.

## 18/11 · correzioni di Ross (v2 di F4, F7, F11, F13, F14)
- ✓ F4: scontrino al posto dell'elenco a lato (niente più fondo scuro: luminosità minima del reel 69 su 255), conto intero a tutto schermo fino alla CTA (non si vede più l'inquadratura successiva di Daniele).
- ✓ F7, F11, F13, F14: coda che continua a muoversi (nessun fermo immagine) e CTA che parte circa 0,4 s dopo l'ultima parola; in F11 la frase barrata esce prima.
- ✓ F13: la bilancia dondola sempre e resta fino a «a che prezzo?» (nel primo piano scende sotto il mento, sottotitoli spenti per 1,3 s).
- ✓ F14: testo sempre dentro le caselle; sei grafiche agganciate alle parole.
- ✓ In questi cinque: almeno ~90-100 px tra grafiche e sottotitoli, sottotitoli sopra i 1500 px, grafiche dentro lo 0,90 della larghezza.
- ⚠ Gli altri dieci (F1 v2, F2, F3, F5, F6, F8, F9, F10, F12, F15) sono come consegnati il 17/11: lo spazio tra grafiche e sottotitoli è quello di prima (40 px). In attesa di Ross: rifarli con il nuovo spazio? rimettere interi F3, F9, F10 (tagli in mezzo)?
