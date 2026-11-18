---
name: feedback-spazio-sottotitoli-grafiche
description: "In tutti i reel più spazio tra sottotitoli e animazioni (~100 px), scritte dentro le caselle, zone sicure di Instagram rispettate"
metadata:
  node_type: memory
  type: feedback
  modified: 2026-11-18
---

Ross, 18/11/2026: «memorizza questo: in tutti i reel deve esserci più spazio tra i sottotitoli e le animazioni, te lo avevo già detto,
e vanno rispettati i layout di Instagram». Stesso giorno, su F14: «le scritte escono dalle box». Era già stato detto il 6/11 (glass box
più distanti dai sottotitoli) e il 12/11 (le grafiche non toccano mai i sottotitoli).

**Why:** con 40 px di aria grafica e sottotitolo si leggono come due testi impilati; e ciò che finisce sotto i 1500 px o nella colonna
dei comandi a destra viene coperto dall'interfaccia di Instagram.

**How to apply:** almeno ~100 px tra il bordo basso di ogni grafica e la scatola dei sottotitoli; sottotitoli con il bordo basso sopra i
1500 px; grafiche dentro x < 0,90. Nel motore CN: `capShift 40`, `gfxScale 0.96` e un `dy` per ogni grafica calcolato con
`npx tsx scripts/f_place.ts ID` (mette la grafica più in alto quando il mento lo permette; ✗ se l'aria è sotto i 90 px: accorciare la
grafica, non avvicinarla). Nelle caselle il corpo del testo si calcola sulla riga più lunga (mai testo che sborda): controllarlo sui
fotogrammi a grandezza reale. Dove il volto è grande e non c'è posto: una sola scritta in basso, sottotitoli spenti per quel tratto.
