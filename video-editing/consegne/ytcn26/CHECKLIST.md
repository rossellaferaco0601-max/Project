# Checklist di consegna · YTCN 26, serie G (21/11/2026)

File in `video-engine/out/ytcn26/consegna/`: per ogni reel `ID_vN.mp4` (1080×1920, 30 fps), `ID_vN.jpg` e `ID_copertina.jpg` (copertina nel formato unico), `ID_didascalia.txt`, `ID_vN_anteprima.mp4`.

| Reel | Durata (video + CTA) | Rappresentazioni | Parola da commentare |
|---|---|---|---|
| G1-brivido v1 | 51.9 + 8 s | titolo a colpo, cappotti che si accumulano con la croce, corridore che si scalda sul quadrante dei 5-10 minuti, scheda finale «da ricordare» | BRIVIDO |
| G2-strati v2 | 57.2 + 8 s | titolo che si condensa, i tre capi che si indossano uno sull'altro, cartellino che dondola, raffica di vento, anelli della sinergia, sudore contro gelo | STRATI (guida) |
| G3-mani v1 | 22.4 + 8 s | titolo spinto dal vento, figura che perde calore da mani e testa, poi guanti, fascia e cappello | GUANTI |
| G4-casa v2 | 42.7 + 8 s | titolo che sale, parole che tremano dal freddo, casa in sezione con anello dei 5 minuti, calore e circolazione | CIRCUITO (guida) |
| G5-climber v1 | 30.2 + 8 s | video a finestra, intestazione dell'esercizio, figura che fa il mountain climber con le zone che si accendono, anelli delle durate | CIRCUITO (guida) |
| G6-ponte v2 | 51.0 + 8 s | video a finestra, figura che fa il ponte, sagoma seduta che passa all'estensione, modalità e durate | CIRCUITO (guida) |
| G7-affondi v2 | 51.5 + 8 s | video a finestra, figura che fa gli affondi, termometro che sale, tempo massimo, scheda finale «da ricordare» | CIRCUITO (guida) |
| G8-jack v2 | 34.6 + 8 s | video a finestra, figura che fa i jumping jack, molle ai tendini, giacca, guanti e fascia che compaiono | CIRCUITO (guida) |
| G9-graduale v1 | 60.7 + 8 s | titolo battuto a macchina, contagiri dell'intensità, batteria dell'energia, riepilogo con le spunte | GRADUALE |
| G10-naso v1 | 52.8 + 8 s | titolo che si condensa, profilo con l'aria fredda che entra dal naso e arriva calda ai polmoni (riscalda, umidifica, filtra, protegge) | INVERNO |
| G11-respiro v1 | 44.2 + 8 s | onda del respiro in affanno che diventa regolare, parole che entrano dai lati | RESPIRO |
| G12-squat v1 | 44.6 + 8 s | titolo a colpo, figura che scende nello squat, casa attorno, arco dei 3-4 minuti, anelli del recupero | SQUAT |

Controlli fatti su ogni reel prima della consegna:
- master: stacchi al fotogramma giusto (`f_cutcheck.py`), nessun lampo di un fotogramma (`f_flash.py`), volto libero su grafiche e sottotitoli (`f_facecheck.ts`, reel nel bosco);
- grafiche: nessuna sovrapposizione e tempi di lettura (`validate-reels.ts`), ~100 px di aria sopra i sottotitoli (`f_place.ts`), fogli di controllo guardati (`cn_stills.ts`);
- file finale: loudness intorno a -14 LUFS, nessun fotogramma nero, nessun lampo, ritrascrizione uguale al parlato, ultimo secondo e mezzo guardato fotogramma per fotogramma;
- finali: G1 e G7 chiudono con la scheda «da ricordare» perché il sorgente cambia inquadratura negli ultimi secondi; G11 e G12 hanno l'ultimo stacco reso morbido (`f_match.py`).

Da fare prima di pubblicare: scrivere le due guide («Come vestirsi per correre al freddo», «Riscaldamento in casa in 5 minuti») per i reel con CTA STRATI e CIRCUITO.
