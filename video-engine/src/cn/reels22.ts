// YTCN 22 · «Il costo invisibile degli infortuni» (video del Drive, 17/11/2026): serie F «Farsi male non è normale».
// Sorgente Full HD già montato con tre camere (137 inquadrature): master con scripts/cn_master_shots.py (un ritaglio per inquadratura,
// mappa in work/ytcn22_shots.json, stacchi fissati al fotogramma), stacco netto tra i pezzi (blend 0).
// Zone: nei piani medi il mento arriva a ~0,50 → grafiche da 0,52 (gfxShift 150), sottotitoli a 0,74-0,79 (capShift 60).
// Nei primi piani (mento oltre 0,52) niente grafiche della zona normale: solo sottotitoli, oppure una scritta nella fascia bassa
// (`dy` / topword `strip`) con i sottotitoli spenti (`hideCaps`), oppure una scheda a tutto schermo se il volto arriva sui sottotitoli.
import words22 from "./words22.json";
import type { CNReelProps } from "./types";
import type { ReelDef } from "./reels51";

const SRC = "ytcn22/ytcn22_src.mp4";
const master = (id: string) => `ytcn22/masters/${id}.mp4`;
/** Pezzi dai punti di taglio dell'audio (silenzi misurati): stacco netto, ogni pezzo dura un numero intero di fotogrammi. */
const cut = (...a: [number, number][]) => a.map(([f, t]) => ({ from: f, to: +(f + Math.round((t - f) * 30) / 30).toFixed(4) }));

const base = {
  src: SRC,
  words: words22 as CNReelProps["words"],
  blendFrames: 0,
  ctaSeconds: 8,
  wordOffset: -0.06, // parole allineate con cn_align.py
  wordFix: {} as Record<string, string>,
  hook: null,
  gfxShift: 150,
  gfxScale: 1,
  capShift: 60,
};
const KICKER = "Infortuni nella corsa";
/** fascia bassa dei primi piani: la grafica scende di LOW px (bordo alto a ~0,65) e i sottotitoli si spengono */
const LOW = { dy: 250, hideCaps: true };

export const REELS22: ReelDef[] = [
  {
    id: "F1-normale",
    title: "Farsi male è normale?",
    cover: { frame: 1416, kicker: KICKER, lines: ["Farsi male", "è normale?"], accent: "normale?" },
    props: {
      ...base,
      master: master("F1-normale"),
      // «Perché farsi male dovrebbe essere normale…Ma ti rendi conto?» + «Non è normale farsi male…e non un nemico.»
      segments: cut([24.84, 65.09], [187.29, 200.91]),
      tailLive: 0.1, // a 201,03 il sorgente cambia inquadratura
      capFrom: 3.9,
      elements: [
        { kind: "topword", at: 0.1, dur: 3.75, zone: "strip", anim: "drop", lines: ["FARSI MALE", "È NORMALE?"], accent: "NORMALE?", hideCaps: true },
        { kind: "slam", at: 9.0, word: "normalizzato", dur: 3.4, lead: ["Una società che ha"], text: "NORMALIZZATO" },
        // le tre frasi fatte (nel sorgente sono in bianco e nero): barrate una alla volta; la terza è in primo piano → fascia bassa
        { kind: "bigstrike", at: 19.0, word: "fa", dur: 1.6, big: true, text: "«Parte del gioco»" },
        { kind: "bigstrike", at: 20.8, word: "chi", dur: 2.2, big: true, text: "«Prima o poi»" },
        { kind: "bigstrike", at: 23.2, word: "gli", dur: 1.9, big: true, text: "«Inevitabili»", ...LOW },
        { kind: "title", at: 31.2, word: "tappe", dur: 2.9, lines: ["Dolore e infortunio:", "tappe obbligatorie?"], accent: "obbligatorie?" },
        { kind: "checklist", at: 35.4, word: "fastidi", dur: 3.3, cues: ["fastidi", "dolori", "infortuni"], items: ["Fastidi", "Dolori", "Infortuni"], cross: true, big: true },
        // primissimo piano (il mento arriva a 0,78): il video si ritira a sinistra, la frase si costruisce a destra, sottotitoli liberi
        { kind: "side", at: 40.27, dur: 5.3, cues: ["normale", "accettabile"], title: "Farsi male", items: ["Non è normale", "Non è accettabile"], pairs: true },
        { kind: "kinetic", at: 50.2, word: "alleato", dur: 3.6, words: ["Alleato", "non nemico"], accentIndex: 0 },
      ],
      cta: { word: "BASTA", title: "Vuoi correre senza farti male?" },
    },
    didascalia: `Farsi male è normale per chi corre? No. Eppure ci siamo abituati a sentirlo dire: «fa parte del gioco», «prima o poi capita», «gli infortuni sono inevitabili».

Il problema di queste frasi è che abbassano l'asticella: se il dolore è una tappa obbligata del percorso, smetti di chiederti da dove arriva e che cosa puoi cambiare nel modo in cui corri, in come prepari il corpo e in come ti alleni. Un fastidio che torna a ogni uscita non è sfortuna: è un'informazione.

Non è normale farsi male e non dovrebbe essere accettabile per nessuno. La corsa deve essere un alleato della tua salute, non un nemico.

Vuoi correre senza farti male? Commenta BASTA e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.

#correrenaturale #infortuni #corsa #running #prevenzione`,
  },
];
