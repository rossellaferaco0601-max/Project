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
  gfxScale: 0.98, // bordo destro a 971 px (dentro lo 0,90)
  capShift: 40,
  // finale morbido: coda di 0,8 s che continua a muoversi (master con `ping`), la CTA parte 0,3 s dopo l'ultima parola
  tailSeconds: 0.8,
  tailHold: 0.3,
  tailLive: 0,
};
const KICKER = "Correre al freddo";
/** circuito in casa (3:55-6:44): video «a finestra» (a tutta larghezza su fondo verde, master con `window`), grafiche nella fascia sopra la finestra */
const WIN = { gfxShift: -613 };
const KICKER_W = "Riscaldamento in casa";
const CAP = (testo: string, chiusa: string) => `${testo}\n\n${chiusa}\n\n#correrenaturale #correrealfreddo #corsa #running #inverno`;
const COACH = (domanda: string, parola: string) => `${domanda} Commenta ${parola} e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.`;
const GUIDA_C = "Vuoi il circuito completo? Commenta CIRCUITO e ti mando gratis la guida «Riscaldamento in casa in 5 minuti».";
/** CTA con guida da scaricare (Ross 21/11): chi commenta riceve una guida di approfondimento invece delle info sul coaching.
 *  Due guide per la serie: come vestirsi (G2) e il circuito di riscaldamento in casa (G4 e i quattro esercizi G5-G8). */
const GUIDA_STRATI = { word: "STRATI", title: "Vuoi vestirti giusto per correre al freddo?", sub: "Scarica gratis la guida", offer: ["Come vestirsi", "per correre al freddo"], dm: "Ti mando la guida" };
const GUIDA_CIRCUITO = { word: "CIRCUITO", title: "Vuoi il circuito completo?", sub: "Scarica gratis la guida", offer: ["Riscaldamento in casa", "in 5 minuti"], dm: "Ti mando la guida" };

export const REELS26: ReelDef[] = [
  {
    id: "G1-brivido",
    title: "L'errore dei troppi strati",
    cover: { frame: 1156, kicker: KICKER, lines: ["Freddo: l'errore", "dei troppi strati"], accent: "troppi strati" },
    props: {
      ...base,
      master: master("G1-brivido"),
      segments: cut([41.62, 92.7]),
      elements: [
        { kind: "fog", anim: "snap", at: 0.1, dur: 4.4, lines: ["Correre al freddo:", "l'errore più comune"], accent: "l'errore più comune" },
        { kind: "gem", dy: -19, art: "over", at: 7.0, word: "vestiamo", dur: 14.2, cues: ["più", "realtà", "incubo"], phases: [{ lines: ["Più strati,", "più calore?"] }, { lines: ["L'errore", "più comune"] }, { lines: ["Un incubo", "di sudore"] }] },
        { kind: "gem", dy: -19, art: "warm", at: 27.9, dur: 11.9, cues: ["congelare", "5-10", "riscaldarsi"], phases: [{ lines: ["Sembra di", "congelare"] }, { lines: ["Dopo", "5-10 minuti"] }, { lines: ["Il corpo", "si scalda"] }], artCues: [0, 1] },
        { kind: "gem", dy: -19, art: "warm", at: 41.0, word: "meglio", dur: 7.8, cues: ["leggera", "brivido", "segnale"], phases: [{ lines: ["Parti con un", "leggero freddo"] }, { lines: ["Brivido", "iniziale"] }, { lines: ["Brivido", "iniziale"], chip: "Vestito giusto" }], artCues: [-1, -1, 1] },
      ],
      cta: { word: "BRIVIDO", title: "Vuoi correre bene anche d'inverno?" },
    },
    didascalia: CAP(`Quando fa freddo la prima cosa a cui pensiamo è coprirci bene. Ma troppo spesso ci vestiamo in modo eccessivo, convinti che più strati significhino più calore e più comfort: è uno degli errori più comuni, e può trasformare la corsa in un incubo di sudore e disagio.

Il segreto è capire come funziona il corpo quando corri al freddo. All'inizio sembra di congelare e la tentazione di mettere un maglione o una giacca pesante è forte, ma dopo i primi 5-10 minuti il corpo comincia a scaldarsi da solo.

Per questo è meglio partire con una leggera sensazione di freddo: quel piccolo brivido iniziale è il segnale che ti sei vestito nel modo giusto e che starai comodo per tutta la corsa.`, COACH("Vuoi correre bene anche d'inverno?", "BRIVIDO")),
  },
  {
    id: "G2-strati",
    title: "Gli strati giusti per correre al freddo",
    cover: { frame: 130, kicker: KICKER, lines: ["Freddo:", "gli strati giusti"], accent: "strati giusti" },
    props: {
      ...base,
      master: master("G2-strati"),
      // «partiamo dalla scelta dei giusti strati … senza quella lotta tra sudore e gelo. Molto fastidiosa.» (tratto intero)
      segments: cut([100.72, 157.04]),
      elements: [
        { kind: "fog", at: 0.1, dur: 2.55, dy: -30, lines: ["Correre al freddo:", "gli strati giusti"], accent: "gli strati giusti" },
        { kind: "layers", at: 3.7, word: "una", dur: 11.6, cues: ["base", "calore", "sudore"], stage: 1, dy: -33, lines: ["Base termica", "traspirante"], chips: ["Calore dentro", "Sudore fuori"] },
        { kind: "hangtag", at: 16.5, word: "tecnica", dur: 4.3, dy: -40, cues: ["tecnica", "corsa"], lines: ["Base tecnica", "per la corsa"] },
        { kind: "layers", at: 22.1, word: "secondo", dur: 6.5, cues: ["secondo", "trattiene", "permette"], stage: 2, dy: -33, lines: ["Strato leggero", "isolante"], chips: ["Tiene caldo", "Fa traspirare"] },
        { kind: "gust", at: 30.7, word: "fredde", dur: 2.95, dy: -40, cues: ["fredde", "ventose"], words: ["Freddo", "Vento"] },
        { kind: "layers", at: 33.95, word: "esterno", dur: 5.3, cues: ["esterno", "antivento", "idrorepellente"], stage: 3, dy: -33, lines: ["Strato esterno"], chips: ["Antivento", "Idrorepellente"] },
        { kind: "rings", at: 40.7, word: "ogni", dur: 6.5, dy: -22, cues: ["ogni", "sinergia", "caldo"], phases: [["Ogni strato", "ha uno scopo"], ["In sinergia"], ["Al caldo", "senza", "surriscaldarti"]] },
        { kind: "duel", at: 53.2, word: "lotta", dur: 3.03, dy: -30, cues: ["lotta", "sudore", "gelo", "molto"], left: "Sudore", right: "Gelo" },
      ],
      cta: GUIDA_STRATI,
    },
    didascalia: `Come ci si veste per correre al freddo? Non con «più roba», ma con gli strati giusti.

Il primo è una base termica traspirante: tiene il calore del corpo senza bloccare il sudore, così eviti quella sensazione di umido freddo. Deve essere tecnica, specifica per la corsa o per gli sport di endurance. Sopra puoi aggiungere un secondo strato leggero e isolante, come un gilet antivento, che trattiene il calore ma lascia traspirare. Per le giornate davvero fredde o molto ventose serve infine uno strato esterno antivento e idrorepellente, che protegge senza appesantire.

Ogni strato ha uno scopo preciso e lavorano insieme: ti tengono al caldo senza farti surriscaldare. Così correre al freddo può diventare addirittura piacevole, senza la lotta continua tra sudore e gelo.

Vuoi la guida completa? Commenta STRATI e ti mando gratis la guida «Come vestirsi per correre al freddo».

#correrenaturale #correrealfreddo #corsa #running #inverno`,
  },
  {
    id: "G3-mani",
    title: "Freddo: copri mani e testa",
    cover: { frame: 302, kicker: KICKER, lines: ["Freddo: copri", "mani e testa"], accent: "mani e testa" },
    props: {
      ...base,
      master: master("G3-mani"),
      segments: cut([157.14, 178.68]),
      elements: [
        { kind: "fog", anim: "wind", at: 0.1, dur: 5.3, lines: ["Freddo: la cosa", "più importante"], accent: "più importante" },
        { kind: "gem", dy: -19, art: "heat", at: 5.9, word: "coprire", dur: 8.6, cues: ["mani", "estremità", "critici", "dissipiamo"], phases: [{ lines: ["Copri mani", "e testa"] }, { lines: ["I punti", "più critici"], on: 2 }, { lines: ["Qui perdi", "più calore"], on: 3 }], artCues: [0, 1] },
        { kind: "gem", dy: -19, art: "heat", at: 16.7, word: "basta", dur: 4.7, cues: ["orecchie", "meglio"], phases: [{ lines: ["Orecchie", "e fronte"] }, { lines: ["Oppure un", "cappello"] }], artCues: [-1, -1, -1, 0, 1] },
      ],
      cta: { word: "GUANTI", title: "Vuoi goderti la corsa anche al freddo?" },
    },
    didascalia: CAP(`La cosa forse più importante da sapere su come vestirsi per correre al freddo: coprire mani e testa.

Le estremità sono i punti più difficili da scaldare per il corpo e quelli da cui disperdiamo più calore. Puoi avere gli strati giusti sul busto, ma se mani e testa restano scoperte il freddo lo senti lo stesso.

Se hai ancora una folta chioma ti basta coprire orecchie e fronte con una fascia. Altrimenti meglio un cappello.`, COACH("Vuoi goderti la corsa anche al freddo?", "GUANTI")),
  },
  {
    id: "G4-casa",
    title: "Il trucco per uscire senza sentire freddo",
    cover: { frame: 868, kicker: KICKER, lines: ["Freddo: scaldati", "prima di uscire"], accent: "prima di uscire" },
    props: {
      ...base,
      master: master("G4-casa"),
      segments: cut([180.52, 222.36]),
      elements: [
        { kind: "fog", anim: "rise", at: 0.1, dur: 3.1, lines: ["Il miglior riscaldamento", "per correre al freddo"], accent: "per correre al freddo" },
        { kind: "kin", anim: "ice", at: 13.3, word: "temperature", dur: 3.1, cues: ["temperature", "abbassano"], words: ["Temperature", "basse"] },
        { kind: "kin", anim: "slide", at: 16.7, word: "preparazione", dur: 4.9, cues: ["preparazione", "infortuni"], words: ["Preparazione mirata", "Meno infortuni"] },
        { kind: "kin", anim: "pulse", at: 22.6, word: "trucco", dur: 2.75, cues: ["trucco"], words: ["Il trucco?"] },
        { kind: "gem", dy: -19, art: "house", at: 25.7, word: "iniziare", dur: 15.9, cues: ["ambiente", "5", "dall'interno", "circolazione", "preparare"], phases: [{ lines: ["Al chiuso,", "in casa"] }, { lines: ["Bastano", "5 minuti"] }, { lines: ["Calore", "dall'interno"] }, { lines: ["Più", "circolazione"] }, { lines: ["Corpo", "pronto"] }] },
      ],
      cta: GUIDA_CIRCUITO,
    },
    didascalia: CAP(`Se c'è una cosa che può cambiare la tua esperienza di corsa al freddo è un buon riscaldamento. E non parlo di qualche saltello prima di partire: quando le temperature si abbassano il corpo ha bisogno di una preparazione mirata, per evitare infortuni e per avere una corsa fluida e piacevole.

Il trucco per uscire senza sentire freddo? Cominciare il riscaldamento in un ambiente chiuso, in casa o in un'area riparata.

Bastano 5 minuti di movimenti ed esercizi mirati per scaldare il corpo dall'interno, aumentare la circolazione e arrivare fuori già pronto.`, GUIDA_C),
  },
  {
    id: "G5-climber",
    title: "Riscaldamento in casa: mountain climber",
    cover: { frame: 240, shiftY: -0.17, kicker: KICKER_W, lines: ["Esercizio 1:", "mountain climber"], accent: "mountain climber" },
    props: {
      ...base,
      ...WIN,
      winHeader: { kicker: KICKER_W, title: "Mountain|climber", n: "1" },
      master: master("G5-climber"),
      segments: cut([240.4, 269.7]),
      elements: [
        { kind: "gem", art: "climber", at: 4.6, word: "oltre", dur: 17.2, cues: ["postura", "superiore", "flessori", "piedi", "scalda"], phases: [{ lines: ["Postura e", "addominali"] }, { lines: ["Parte", "superiore"] }, { lines: ["Flessori", "dell'anca"] }, { lines: ["Anche", "i piedi"] }, { lines: ["Scalda", "per bene"] }] },
        { kind: "dose", at: 22.5, dur: 6.3, cues: ["20", "30", "minuto"], items: ["20 sec", "30 sec", "1 min"] },
      ],
      cta: GUIDA_CIRCUITO,
    },
    didascalia: CAP(`Primo esercizio del circuito di riscaldamento da fare in casa prima di uscire a correre al freddo: il mountain climber.

Scalda molto bene e intanto fa lavorare la postura, gli addominali e la parte superiore del corpo. In più lavora sui flessori dell'anca e attiva anche i piedi: si muove tutto.

Puoi farlo per 20 secondi, 30 secondi o un minuto: basta questo per alzare il calore interno.`, GUIDA_C),
  },
  {
    id: "G6-ponte",
    title: "Riscaldamento in casa: ponte per i glutei",
    cover: { frame: 250, shiftY: -0.17, kicker: KICKER_W, lines: ["Esercizio 2:", "ponte per i glutei"], accent: "ponte per i glutei" },
    props: {
      ...base,
      ...WIN,
      winHeader: { kicker: KICKER_W, title: "Ponte|per i glutei", n: "2" },
      tailSeconds: 1.4, // l'ultima durata («un minuto») arriva a fine frase: la coda è più lunga perché resti a schermo più di un secondo
      tailHold: 0.9,
      master: master("G6-ponte"),
      segments: cut([269.72, 319.24]),
      elements: [
        { kind: "gem", art: "bridge", at: 6.0, word: "ponte", dur: 11.6, cues: ["glutei", "postura", "estensione"], phases: [{ lines: ["Ponte per", "i glutei"] }, { lines: ["Postura"] }, { lines: ["Estensione", "delle anche"] }], artCues: [0, 2] },
        { kind: "gem", art: "bridge", at: 29.2, dur: 12.0, cues: ["seduto", "sveglio", "flessione", "fermo"], phases: [{ lines: ["Sei stato", "seduto?"] }, { lines: ["O appena", "sveglio?"] }, { lines: ["Corpo in", "flessione"] }, { lines: ["Fermo e", "immobile"] }], artCues: [-1, -1, 0] },
        { kind: "dose", at: 42.2, dur: 8.0, cues: ["dinamico", "statico", "30", "minuto"], tags: ["Dinamico", "Statico"], items: ["30 sec", "1 min"] },
      ],
      cta: GUIDA_CIRCUITO,
    },
    didascalia: CAP(`Secondo esercizio del circuito di riscaldamento in casa: dopo il mountain climber ci si gira e si fa il ponte per i glutei.

Anche qui si lavora sulla postura: si va in estensione con le anche e con il bacino, e intanto si recupera dall'esercizio precedente senza fermarsi.

È prezioso soprattutto se vai a correre dopo essere stato seduto o appena sveglio, cioè dopo ore in posizioni di flessione o con il corpo fermo. Puoi farlo dinamico oppure statico, per 30 secondi o un minuto.`, GUIDA_C),
  },
  {
    id: "G7-affondi",
    title: "Riscaldamento in casa: affondi",
    cover: { frame: 270, shiftY: -0.17, kicker: KICKER_W, lines: ["Esercizio 3:", "gli affondi"], accent: "gli affondi" },
    props: {
      ...base,
      ...WIN,
      winHeader: { kicker: KICKER_W, title: "Affondi", n: "3" },
      master: master("G7-affondi"),
      segments: cut([319.4, 370.06]),
      elements: [
        { kind: "gem", art: "lunge", at: 4.4, word: "affondo", dur: 6.4, cues: ["affondo", "coordinata"], phases: [{ lines: ["Affondi"] }, { lines: ["Coordinati", "e gentili"] }], artCues: [0] },
        { kind: "gem", art: "lunge", at: 12.0, word: "non", dur: 7.6, cues: ["male", "dall'interno", "muscolatura"], phases: [{ lines: ["Senza", "farsi male"] }, { lines: ["Caldi", "dall'interno"] }, { lines: ["Muscoli", "attivi"] }], artCues: [-1, 1] },
        { kind: "gem", art: "lunge", at: 33.4, word: "fanno", dur: 10.0, cues: ["tutto", "inferiore", "temperatura"], phases: [{ lines: ["Lavora", "tutto il corpo"] }, { lines: ["Parte", "inferiore"] }, { lines: ["Sale la", "temperatura"] }], artCues: [-1, -1, 2] },
        { kind: "gem", art: "lunge", at: 46.9, word: "non", dur: 3.6, cues: ["minuto"], phases: [{ lines: ["Massimo", "un minuto"], chip: "Solo scaldarsi" }], artCues: [-1, -1, -1, 0] },
      ],
      cta: GUIDA_CIRCUITO,
    },
    didascalia: CAP(`Terzo esercizio del circuito di riscaldamento in casa: ci si alza e si fa qualche affondo, sempre in maniera coordinata e gentile.

Qui non devi rischiare di farti male: stai scaldando il corpo dall'interno, attivando la muscolatura e facendo capire al corpo che tra poco gli chiederai un po' di performance.

Gli affondi fanno lavorare bene tutto il corpo, soprattutto la parte inferiore, e alzano la temperatura interna. Non superare il minuto: lo scopo non è affaticarsi, è solo scaldarsi.`, GUIDA_C),
  },
  {
    id: "G8-jack",
    title: "Riscaldamento in casa: jumping jack",
    cover: { frame: 45, shiftY: -0.17, kicker: KICKER_W, lines: ["Esercizio 4:", "jumping jack"], accent: "jumping jack" },
    props: {
      ...base,
      ...WIN,
      winHeader: { kicker: KICKER_W, title: "Jumping|jack", n: "4" },
      master: master("G8-jack"),
      segments: cut([370.36, 404.06]),
      elements: [
        { kind: "gem", art: "jack", at: 2.6, word: "jumping", dur: 17.8, cues: ["temperatura", "tendini", "30", "sudando", "pronto"], phases: [{ lines: ["Più", "temperatura"] }, { lines: ["Scalda", "i tendini"] }, { lines: ["30 secondi", "o un minuto"] }, { lines: ["Quasi", "sudato"] }, { lines: ["Pronto", "a uscire"] }], artCues: [0, 1, 3] },
        { kind: "gem", art: "jack", at: 21.6, word: "mettere", dur: 12.0, cues: ["giacca", "guanti", "cappello", "estremo", "guanti"], phases: [{ lines: ["Giacca", "antivento"] }, { lines: ["Guanti"] }, { lines: ["Cappello", "e fascia"] }, { lines: ["Freddo non", "estremo?"] }, { lines: ["Solo guanti", "e fascia"] }], artCues: [-1, -1, -1, 0, 1, 2] },
      ],
      cta: GUIDA_CIRCUITO,
    },
    didascalia: CAP(`Ultimo esercizio del circuito di riscaldamento in casa: finiti gli affondi, qualche jumping jack.

Alzano la temperatura corporea e scaldano anche i tendini. Trenta secondi o un minuto, vedi tu: alla fine sei già quasi sudato e pronto a uscire.

Se fa molto, molto freddo metti giacca antivento, guanti, cappello e fascia. Se è freddo ma non estremo puoi uscire anche così, solo con guanti e fascia.`, GUIDA_C),
  },
  {
    id: "G9-graduale",
    title: "La corsa di riscaldamento",
    cover: { frame: 1106, kicker: KICKER, lines: ["La corsa", "di riscaldamento"], accent: "di riscaldamento" },
    props: {
      ...base,
      master: master("G9-graduale"),
      segments: cut([404.14, 463.98]),
      elements: [
        { kind: "fog", anim: "type", at: 0.1, dur: 3.6, lines: ["Appena esci:", "corsa di riscaldamento"], accent: "corsa di riscaldamento" },
        { kind: "gem", dy: -19, art: "gauge", at: 9.1, word: "corsa", dur: 13.2, cues: ["intensità", "camminata", "tendini", "nervoso"], phases: [{ lines: ["Intensità", "molto bassa"] }, { lines: ["Al passo della", "camminata"] }, { lines: ["Tendini,", "articolazioni", "e muscoli"] }, { lines: ["Sistema", "nervoso"] }] },
        { kind: "gem", dy: -11, art: "battery", at: 27.7, word: "permette", dur: 17.2, cues: ["energia", "attivo", "sprecare", "godersi"], phases: [{ lines: ["Energia", "più efficiente"] }, { lines: ["Già attivo", "e pronto"] }, { lines: ["Niente energia", "sprecata"] }, { lines: ["Dall'inizio", "alla fine"] }], artCues: [0, 2, 3] },
        { kind: "ticks", at: 47.0, word: "riscaldati", dur: 11.8, cues: ["riscaldati", "primi", "pronto"], items: ["Prima: scaldati", "Fuori: graduale"], foot: "Pronto e carico" },
      ],
      cta: { word: "GRADUALE", title: "Vuoi goderti la corsa dall'inizio alla fine?" },
    },
    didascalia: CAP(`Una volta uscito, aggiungi un breve periodo di camminata o una corsa molto leggera: la corsa di riscaldamento. È una corsa a intensità molto bassa, anche alla stessa velocità della camminata, che prepara tendini, articolazioni e muscoli e fa capire al sistema nervoso che l'allenamento sta cominciando.

C'è di più: ti permette di usare la tua energia in modo più efficiente. Entri nella parte intensa dell'allenamento già attivo e pronto, invece di sprecare energia per scaldarti nei primi chilometri. Ed è questo che fa la differenza per goderti la corsa dall'inizio alla fine, anche nelle giornate più fredde.

Ricapitolando: scaldati bene prima di uscire e nei primi minuti fai un riscaldamento graduale. Anche se fuori fa molto freddo sarai pronto e carico, invece di lottare per scaldarti strada facendo.`, COACH("Vuoi goderti la corsa dall'inizio alla fine?", "GRADUALE")),
  },
  {
    id: "G10-naso",
    title: "Come respirare quando fa freddo",
    cover: { frame: 1456, kicker: KICKER, lines: ["Aria fredda?", "Respira dal naso"], accent: "Respira dal naso" },
    props: {
      ...base,
      master: master("G10-naso"),
      segments: cut([472.52, 524.5]),
      elements: [
        { kind: "fog", anim: "fog", at: 0.1, dur: 3.4, lines: ["Come respirare", "quando fa freddo"], accent: "quando fa freddo" },
        { kind: "gem", dy: -19, art: "nose", at: 12.3, word: "sentire", dur: 6.5, cues: ["fastidio", "aria"], phases: [{ lines: ["Fastidio", "nei polmoni"] }, { lines: ["Aria", "tagliente"] }], artCues: [] },
        { kind: "kin", anim: "pulse", at: 29.4, word: "controllata", dur: 2.6, cues: ["controllata", "piacevole"], words: ["Controllata", "e piacevole"] },
        { kind: "gem", dy: -19, art: "nose", at: 33.2, word: "imparare", dur: 7.4, cues: ["naso", "riscaldare", "umidificare"], phases: [{ lines: ["Respira", "dal naso"] }, { lines: ["Riscalda", "l'aria"] }, { lines: ["Umidifica", "l'aria"] }], artCues: [1, 2] },
        // da 40,8 a 44,9 il sorgente è in primo piano (mento a 0,53): niente grafica, solo sottotitoli
        { kind: "gem", dy: -19, art: "nose", at: 45.2, word: "ebbene", dur: 6.5, cues: ["naturale", "filtrarla", "proteggere"], phases: [{ lines: ["Il modo", "naturale"] }, { lines: ["La filtra"] }, { lines: ["Protegge", "le vie", "respiratorie"] }], artCues: [-1, -1, 1, 2] },
      ],
      cta: { word: "INVERNO", title: "Vuoi respirare bene anche al freddo?" },
    },
    didascalia: CAP(`Correre al freddo non mette alla prova solo tendini, muscoli e articolazioni, ma anche la capacità di respirare in modo confortevole e fluido. Se ti è capitato di sentire un fastidio nei polmoni o quella sensazione di aria tagliente durante la corsa invernale, non sei solo: è una cosa che scoraggia molti corridori.

Con il giusto approccio quella sensazione di disagio può diventare una respirazione controllata e piacevole. Il primo consiglio è imparare a respirare dal naso.

Il naso riscalda e umidifica l'aria prima che arrivi ai polmoni, riducendo l'impatto dell'aria fredda sul sistema respiratorio. È il modo naturale per riscaldare l'aria, filtrarla e proteggere le vie respiratorie.`, COACH("Vuoi respirare bene anche al freddo?", "INVERNO")),
  },
  {
    id: "G11-respiro",
    title: "Niente affanno: respirazione controllata",
    cover: { frame: 494, kicker: KICKER, lines: ["Naso e corsa:", "niente affanno"], accent: "niente affanno" },
    props: {
      ...base,
      master: master("G11-respiro"),
      segments: cut([524.56, 567.9]),
      elements: [
        { kind: "gem", dy: -19, art: "breath", at: 0.15, dur: 6.9, cues: ["difficile"], phases: [{ lines: ["Solo dal naso", "mentre corri"], on: -1 }, { lines: ["Solo dal naso", "mentre corri"], chip: "Difficile?", on: 0 }], artCues: [0] },
        { kind: "kin", anim: "slide", at: 10.4, word: "davvero", dur: 2.4, cues: ["grande", "differenza"], words: ["Grande", "differenza"] },
        { kind: "gem", dy: -19, art: "breath", at: 13.05, dur: 16.1, cues: ["controllata", "fretta", "intensità", "costante", "affanno"], phases: [{ lines: ["Controllata", "e regolare"] }, { lines: ["Niente fretta", "all'inizio"] }, { lines: ["Intensità", "bassa"] }, { lines: ["Intensità", "costante"] }, { lines: ["Mai in", "affanno"] }], artCues: [-1, 0, 2] },
        { kind: "gem", dy: -19, art: "breath", at: 34.6, word: "dà", dur: 8.5, cues: ["padronanza", "esperienza"], phases: [{ lines: ["Padronanza", "e sicurezza"] }, { lines: ["Esperienza", "gratificante"] }], artCues: [-1, -1, -1, 0] },
      ],
      cta: { word: "RESPIRO", title: "Vuoi correre senza andare in affanno?" },
    },
    didascalia: CAP(`Lo so: respirare solo dal naso mentre corri può sembrare difficile, soprattutto se non sei abituato. Ma respirare esclusivamente dal naso può fare davvero una grande differenza.

Mantieni la respirazione controllata e regolare e non farti prendere dalla fretta nei primi minuti, quando il corpo si sta ancora adattando. Parti sempre a un'intensità bassa e costante, e stai attento a non andare in affanno fin da subito.

Respirare bene non rende solo più confortevole la corsa al freddo: ti dà una sensazione di padronanza e sicurezza, e trasforma quella che sembrava una sfida insormontabile in un'esperienza gratificante.`, COACH("Vuoi correre senza andare in affanno?", "RESPIRO")),
  },
  {
    id: "G12-squat",
    title: "Dopo la corsa: lo squat naturale",
    cover: { frame: 950, kicker: KICKER, lines: ["Dopo la corsa:", "squat naturale"], accent: "squat naturale" },
    props: {
      ...base,
      master: master("G12-squat"),
      segments: cut([609.58, 653.28]),
      elements: [
        { kind: "fog", anim: "snap", at: 0.1, dur: 4.0, lines: ["Dopo la corsa:", "il movimento più potente"], accent: "il movimento più potente" },
        { kind: "gem", dy: -19, art: "squat", at: 4.9, word: "per", dur: 12.5, cues: ["squat", "ambiente"], phases: [{ lines: ["Il movimento", "più potente"], on: -1 }, { lines: ["Squat", "naturale"], on: 0 }, { lines: ["Al chiuso", "o al riparo"], on: 1 }] },
        { kind: "gem", dy: -19, art: "squat", at: 20.3, word: "solo", dur: 9.5, cues: ["recupero", "manutenzione", "indolenzimenti"], phases: [{ lines: ["Migliora", "il recupero"] }, { lines: ["Fa", "manutenzione"] }, { lines: ["Meno", "indolenzimenti"] }], artCues: [-1, -1, 9, 0] },
        { kind: "gem", dy: -19, art: "squat", at: 34.0, word: "bastano", dur: 9.3, cues: ["3-4", "investimento", "qualità"], phases: [{ lines: ["Bastano", "3-4 minuti"] }, { lines: ["Un investimento", "che ripaga"] }, { lines: ["Qualità", "e salute"] }], artCues: [-1, -1, 0, -1] },
      ],
      cta: { word: "SQUAT", title: "Vuoi recuperare meglio dopo la corsa?" },
    },
    didascalia: CAP(`Il movimento più potente che puoi fare dopo la corsa? Per me è lo squat naturale.

Quando le temperature sono molto basse, defaticamento e stretching vanno fatti in un ambiente chiuso, o almeno riparato. Questo piccolo rituale dopo la corsa migliora il recupero e fa la manutenzione che serve a prevenire quegli indolenzimenti che affliggono tanti corridori.

Bastano 3-4 minuti di squat naturale: pochi minuti dedicati al recupero sono un investimento che ti ripaga nella qualità delle tue corse e nella salute del tuo corpo.`, COACH("Vuoi recuperare meglio dopo la corsa?", "SQUAT")),
  },
];
