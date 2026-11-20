// YTCN 26 · «Correre al freddo» (video del Drive «YTCN26 NO SCRITTE», 20/11/2026): serie G.
// Sorgente Full HD già montato, senza scritte: nel bosco una sola camera frontale con ingrandimenti (volto al centro, mento tra 0,37 e 0,52),
// in casa il circuito di riscaldamento (3:55-6:44, corpo intero e dettagli). Master con scripts/cn_master_shots.py (mappa in
// work/ytcn26_shots.json, stacchi fissati al fotogramma). Ogni reel è un tratto INTERO del video (regola 18/11: niente tagli inutili).
// Assetto del 18/11 per tutta la serie: sottotitoli tra 1405 e 1497 px, grafiche al 96 % con almeno ~100 px di aria sopra i sottotitoli,
// finale morbido prima della CTA. Le rappresentazioni animate (Elements10 + cartella gem/) sono inedite: una per reel.
import words26 from "./words26.json";
import type { CNReelProps } from "./types";
import type { ReelDef } from "./reels51";

const SRC = "ytcn26/ytcn26_src.mp4";
const master = (id: string) => `ytcn26/masters/${id}.mp4`;
/** Pezzi dai punti di taglio dell'audio (silenzi misurati): ogni pezzo dura un numero intero di fotogrammi. */
const cut = (...a: [number, number][]) => a.map(([f, t]) => ({ from: f, to: +(f + Math.round((t - f) * 30) / 30).toFixed(4) }));

const base = {
  src: SRC,
  words: words26 as CNReelProps["words"],
  blendFrames: 0,
  ctaSeconds: 8,
  wordOffset: -0.06, // parole allineate con cn_align.py
  wordFix: {} as Record<string, string>,
  hook: null,
  gfxShift: 150,
  gfxScale: 0.96,
  capShift: 40,
  // finale morbido: coda di 0,8 s che continua a muoversi (master con `ping`), la CTA parte 0,3 s dopo l'ultima parola
  tailSeconds: 0.8,
  tailHold: 0.3,
  tailLive: 0,
};
const KICKER = "Correre al freddo";

export const REELS26: ReelDef[] = [
  {
    id: "G2-strati",
    title: "Gli strati giusti per correre al freddo",
    cover: { frame: 130, kicker: KICKER, lines: ["Freddo: gli", "strati giusti"], accent: "strati giusti" },
    props: {
      ...base,
      master: master("G2-strati"),
      // «partiamo dalla scelta dei giusti strati … senza quella lotta tra sudore e gelo. Molto fastidiosa.» (tratto intero)
      segments: cut([100.72, 157.04]),
      elements: [
        { kind: "fog", at: 0.1, dur: 2.55, lines: ["Correre al freddo:", "gli strati giusti"], accent: "gli strati giusti" },
        { kind: "layers", at: 3.7, word: "una", dur: 11.6, cues: ["base", "calore", "sudore"], stage: 1, lines: ["Base termica", "traspirante"], chips: ["Calore dentro", "Sudore fuori"] },
        { kind: "hangtag", at: 16.5, word: "tecnica", dur: 4.3, cues: ["tecnica", "corsa"], lines: ["Base tecnica", "per la corsa"] },
        { kind: "layers", at: 22.1, word: "secondo", dur: 6.5, cues: ["secondo", "trattiene", "permette"], stage: 2, lines: ["Strato leggero", "isolante"], chips: ["Tiene caldo", "Fa traspirare"] },
        { kind: "gust", at: 30.7, word: "fredde", dur: 2.95, cues: ["fredde", "ventose"], words: ["Freddo", "Vento"] },
        { kind: "layers", at: 33.95, word: "esterno", dur: 5.3, cues: ["esterno", "antivento", "idrorepellente"], stage: 3, lines: ["Strato esterno"], chips: ["Antivento", "Idrorepellente"] },
        { kind: "rings", at: 40.7, word: "ogni", dur: 6.5, cues: ["ogni", "sinergia", "caldo"], phases: [["Ogni strato", "ha uno scopo"], ["In sinergia"], ["Al caldo", "senza", "surriscaldarti"]] },
        { kind: "duel", at: 53.2, word: "lotta", dur: 3.03, cues: ["lotta", "sudore", "gelo", "molto"], left: "Sudore", right: "Gelo" },
      ],
      cta: { word: "STRATI", title: "Vuoi correre bene anche d'inverno?" },
    },
    didascalia: `Come ci si veste per correre al freddo? Non con «più roba», ma con gli strati giusti.

Il primo è una base termica traspirante: tiene il calore del corpo senza bloccare il sudore, così eviti quella sensazione di umido freddo. Deve essere tecnica, specifica per la corsa o per gli sport di endurance. Sopra puoi aggiungere un secondo strato leggero e isolante, come un gilet antivento, che trattiene il calore ma lascia traspirare. Per le giornate davvero fredde o molto ventose serve infine uno strato esterno antivento e idrorepellente, che protegge senza appesantire.

Ogni strato ha uno scopo preciso e lavorano insieme: ti tengono al caldo senza farti surriscaldare. Così correre al freddo può diventare addirittura piacevole, senza la lotta continua tra sudore e gelo.

Vuoi correre bene anche d'inverno? Commenta STRATI e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.

#correrenaturale #correrealfreddo #corsa #running #inverno`,
  },
];
