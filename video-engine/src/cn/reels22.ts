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
  {
    id: "F2-ciclista",
    title: "Se un ciclista cadesse sempre",
    cover: { frame: 300, kicker: KICKER, lines: ["Se un ciclista","cadesse sempre?"], accent: "cadesse sempre?" },
    props: {
      ...base,
      master: master("F2-ciclista"),
      segments: cut([73.95, 110.45]),
      tailLive: 0,
      capFrom: 4.7,
      elements: [
        { kind: "question", at: 0.15, dur: 4.4, label: "La convinzione", text: "Farsi male è inevitabile?" },
        { kind: "kinetic", at: 10.0, word: "rassegnati", dur: 2.6, words: ["Ci siamo", "rassegnati"], accentIndex: 1 },
        // l'esempio del ciclista: la frase, poi il giudizio come un timbro; subito dopo lo stesso schema per chi corre
        { kind: "stamp", at: 22.9, word: "ciclista", dur: 5.8, cues: ["ciclista", "uscita", "normale"], lines: ["Un ciclista che cade", "a ogni uscita"], stamp: "Non è normale" },
        { kind: "stamp", at: 33.0, dur: 3.4, lines: ["Chi corre", "e si fa male"], stamp: "«È normale»", tone: "coral" },
      ],
      cta: { word: "BICI", title: "Vuoi smettere di farti male?" },
    },
    didascalia: `Se un ciclista cadesse a ogni uscita, nessuno direbbe che è normale: diremmo che c'è qualcosa di sbagliato nel modo in cui va in bicicletta. Con la corsa, invece, ci siamo rassegnati.

Accettare fastidi, dolori e infortuni come inevitabili abbassa gli standard e ci toglie la voglia di cercare soluzioni prima che il problema arrivi. Il punto non è la sfortuna: è guardare a come corri, a quanto è pronto il tuo corpo e a come ti alleni, esattamente come faresti con qualsiasi altro gesto che continua a farti cadere.

Applica alla corsa lo stesso ragionamento che applicheresti alla bici: se ti fai male spesso, qualcosa si può correggere.

Vuoi capire da dove partire? Commenta BICI e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.

#correrenaturale #infortuni #corsa #running #prevenzione`,
  },
  {
    id: "F3-fastidi",
    title: "Quante volte ti sei infortunato?",
    cover: { frame: 142, kicker: KICKER, lines: ["Quante volte","ti sei infortunato?"], accent: "infortunato?" },
    props: {
      ...base,
      master: master("F3-fastidi"),
      segments: cut([0.0, 22.7], [110.5, 118.38], [126.52, 139.2]),
      tailLive: 0.1,
      capFrom: 3.5,
      elements: [
        { kind: "split", at: 0.05, dur: 3.3, lines: ["Quante volte", "ti sei infortunato?"], accent: "infortunato?" },
        { kind: "title", at: 9.0, word: "intendo", dur: 4.8, lines: ["Anche i fastidi", "sono infortuni"], accent: "fastidi" },
        { kind: "kinetic", at: 26.45, dur: 2.3, words: ["Migliorare", "la tua vita"], accentIndex: 0 },
        { kind: "chips", at: 32.9, dur: 6.6, cues: ["forti", "sani", "energia"], items: ["Più forti", "Più sani", "Pieni di energia"] },
      ],
      cta: { word: "FASTIDI", title: "Vuoi correre senza fastidi?" },
    },
    didascalia: `Quante volte ti sei infortunato? E non parlo solo dello stop che ti ha messo KO: parlo anche di quei dolori e di quei fastidi che ti porti dietro nella corsa e nella vita di tutti i giorni.

Sono proprio i fastidi «sopportabili» quelli che si sottovalutano di più: non ti fermano, ma ti impediscono di allenarti bene e di sentirti bene, e intanto mettono a rischio la tua corsa e il tuo benessere. Ascoltarli quando sono piccoli è il modo più semplice per non doverli affrontare quando sono diventati grandi.

La corsa dovrebbe migliorare la tua vita, non danneggiarla: più forza, più salute, più energia, senza essere limitato da dolori continui.

Vuoi tornare a correre così? Commenta FASTIDI e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.

#correrenaturale #infortuni #fastidi #corsa #running`,
  },
  {
    id: "F4-prezzi",
    title: "I 5 prezzi di un infortunio",
    cover: { frame: 318, kicker: KICKER, lines: ["I 5 prezzi","di un infortunio"], accent: "5 prezzi" },
    props: {
      ...base,
      master: master("F4-prezzi"),
      segments: cut([201.05, 210.1], [221.2, 245.3], [289.56, 294.76], [349.7, 355.0], [397.4, 402.74], [442.0, 451.76]),
      tailLive: 0,
      capFrom: 3.9,
      elements: [
        { kind: "kinetic", at: 0.15, dur: 3.6, words: ["Infortuni:", "il costo", "invisibile"], accentIndex: 2 },
        { kind: "title", at: 21.0, word: "influire", dur: 3.0, lines: ["Non solo", "sulla corsa"], accent: "corsa" },
        // i cinque prezzi: il video si ritira a sinistra e l'elenco si costruisce a destra, una voce per ogni «prezzo da pagare»
        { kind: "side", at: 28.13, dur: 29.6, cues: ["primo", "secondo", "terzo", "quarto", "quinto"], title: "5 prezzi", items: ["Limiti fisici", "Mente", "Salute e forma", "Progressi", "Ricadute"] },
      ],
      cta: { word: "PREZZO", title: "Vuoi smettere di pagare questi prezzi?" },
    },
    didascalia: `Nessuno può permettersi di infortunarsi, perché gli infortuni hanno un costo invisibile che va oltre la corsa e che in pochi mettono a bilancio.

Un infortunio non è solo uno stop temporaneo: è un costo fisico, emotivo e mentale. I prezzi da pagare sono cinque: le limitazioni fisiche immediate, l'impatto psicologico e la demotivazione, il benessere generale con salute e forma fisica, la perdita dei progressi e, per chi non impara dagli errori, il rischio di infortuni ricorrenti.

Conoscerli serve a una cosa sola: smettere di considerare l'infortunio un incidente di percorso e iniziare a fare qualcosa prima che arrivi.

Vuoi lavorare sulla prevenzione? Commenta PREZZO e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.

#correrenaturale #infortuni #prevenzione #corsa #running`,
  },
  {
    id: "F5-liberta",
    title: "Il primo prezzo: la tua libertà",
    cover: { frame: 854, kicker: KICKER, lines: ["Un infortunio","non ferma solo la corsa"], accent: "non ferma" },
    props: {
      ...base,
      master: master("F5-liberta"),
      segments: cut([246.1, 287.48]),
      tailLive: 0,
      capFrom: 4.8,
      elements: [
        { kind: "title", at: 0.15, dur: 4.5, lines: ["Un infortunio", "non ferma solo la corsa"], accent: "corsa" },
        { kind: "switches", at: 18.2, dur: 5.9, cues: ["scale", "guidare", "portare"], title: "Azioni di tutti i giorni", items: ["Salire le scale", "Guidare", "Uscire col cane"] },
        { kind: "chat", at: 31.0, dur: 3.55, cues: ["genitore", "compagno"], sender: "I ruoli della tua vita", messages: ["Genitore", "Compagno"] },
        { kind: "kinetic", at: 38.8, dur: 2.8, words: ["Non me lo posso", "permettere"], accentIndex: 1 },
      ],
      cta: { word: "LIBERO", title: "Vuoi tornare a muoverti senza dolore?" },
    },
    didascalia: `Un infortunio non ferma solo la corsa: tocca la capacità di fare le cose di tutti i giorni.

Un problema al ginocchio o alla caviglia rende difficile salire le scale, guidare, portare a spasso il cane. E poi ci sono gli altri ruoli della tua vita: da infortunato o con dolori fai più fatica a essere il genitore e il compagno che vorresti, e rendi meno al lavoro. È il primo prezzo che si paga, ed è quello che si sente subito: la libertà di movimento.

Per questo la domanda giusta non è «quanto starò fermo», ma «posso permettermelo?». Daniele la sua risposta la dà nel video.

Vuoi proteggere la tua libertà di movimento? Commenta LIBERO e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.

#correrenaturale #infortuni #libertadimovimento #corsa #running`,
  },
  {
    id: "F6-valvola",
    title: "Quando perdi la tua valvola di sfogo",
    cover: { frame: 304, kicker: KICKER, lines: ["Se perdi","la tua valvola di sfogo"], accent: "valvola di sfogo" },
    props: {
      ...base,
      master: master("F6-valvola"),
      segments: cut([294.8, 322.44]),
      tailLive: 0,
      capFrom: 3.6,
      elements: [
        { kind: "slam", at: 0.1, dur: 7.5, cues: ["chi", "sa", "devastante"], lead: ["Chi si è fatto male", "lo sa: è"], text: "Devastante" },
        { kind: "cycle", at: 11.6, word: "frustrazione", dur: 4.1, cues: ["frustrazione", "colpa", "motivazione"], items: ["Frustrazione", "Senso di colpa", "Demotivazione"] },
        { kind: "title", at: 17.4, word: "sfogo", dur: 3.3, lines: ["Sfogo, condivisione", "e stacco"], accent: "stacco" },
        { kind: "pressure", at: 21.9, word: "perdere", dur: 5.6, cues: ["umore"], title: "Senza valvola di sfogo", label: "La pressione sale", end: "Umore giù" },
      ],
      cta: { word: "SFOGO", title: "Vuoi correre con continuità?" },
    },
    didascalia: `Chi è stato vittima di un infortunio lo sa: il colpo più duro non è alle gambe, è alla testa.

Non poter correre per settimane o mesi porta frustrazione, senso di colpa e perdita di motivazione. Per molti runner la corsa è un momento di sfogo, di condivisione e di stacco dalla quotidianità: quando quella valvola si chiude, ne risentono l'umore e la qualità della vita, anche lontano dalle scarpe da corsa.

Ecco perché la continuità vale più di qualsiasi allenamento «eroico»: correre bene oggi serve a poter correre anche domani.

Vuoi costruire questa continuità? Commenta SFOGO e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.

#correrenaturale #infortuni #motivazione #corsa #running`,
  },
  {
    id: "F7-declino",
    title: "Il circolo vizioso dello stop",
    cover: { frame: 404, kicker: KICKER, lines: ["Il circolo vizioso","dello stop"], accent: "circolo vizioso" },
    props: {
      ...base,
      master: master("F7-declino"),
      segments: cut([355.068, 395.92]),
      tailLive: 0,
      capFrom: 3.8,
      elements: [
        { kind: "topword", at: 0.15, dur: 3.5, y: 0.53, anim: "drop", lines: ["Se ti fermi", "cosa perdi davvero?"], accent: "davvero?", hideCaps: true },
        { kind: "drain", at: 12.5, dur: 6.4, cues: ["energia", "umore", "forma"], title: "Se non corri", items: ["Energia", "Umore", "Forma fisica"] },
        { kind: "drain", at: 19.4, dur: 6.3, cues: ["energia", "umore", "forma"], title: "Se ti muovi", items: ["Energia", "Umore", "Forma fisica"], fill: true },
        { kind: "kinetic", at: 36.6, word: "circolo", dur: 3.4, words: ["Circolo", "vizioso"], accentIndex: 1 },
      ],
      cta: { word: "FORMA", title: "Vuoi restare in forma correndo?" },
    },
    didascalia: `Gli infortuni non bloccano solo i benefici della corsa: influenzano la salute generale.

Non poter correre, o farlo in modo limitato e discontinuo per dolori e fastidi, incide sui livelli di energia, sull'umore e sulla forma fisica. L'attività fisica aumenta l'energia, migliora l'umore e aiuta a mantenersi in salute: quando ci fermiamo tutto questo viene meno, il corpo perde tonicità e si entra in un circolo vizioso che porta piano piano al declino.

La forma non si difende con il singolo allenamento perfetto, ma con la possibilità di muoversi con regolarità, senza stop forzati.

Vuoi allenarti senza interruzioni? Commenta FORMA e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.

#correrenaturale #infortuni #formafisica #corsa #running`,
  },
  {
    id: "F8-zero",
    title: "Ricominciare da zero",
    cover: { frame: 250, kicker: KICKER, lines: ["Mesi di progressi","persi"], accent: "persi" },
    props: {
      ...base,
      master: master("F8-zero"),
      segments: cut([402.8, 441.94]),
      tailLive: 0,
      capFrom: 3.5,
      elements: [
        { kind: "progress", at: 0.15, dur: 7.4, cues: ["per", "perdere"], title: "Mesi di allenamento", label: "Progressi", after: "Dopo l'infortunio", zero: "Persi" },
        { kind: "lights", at: 9.7, dur: 6.3, cues: ["fastidi", "dolori", "infortuni"], title: "Segnali ignorati", items: ["Fastidi", "Dolori", "Infortuni"] },
        { kind: "kinetic", at: 29.6, word: "zero", dur: 3.0, words: ["Ricominciare", "da zero"], accentIndex: 1 },
        { kind: "title", at: 37.0, word: "imparato", dur: 1.9, lines: ["Prima impara", "dagli errori"], accent: "errori" },
      ],
      cta: { word: "PROGRESSI", title: "Vuoi tenerti i tuoi progressi?" },
    },
    didascalia: `Per un corridore fermarsi per un infortunio significa spesso perdere i progressi guadagnati con mesi e mesi di allenamento.

Di solito la storia è questa: ci si allena sopra un fastidio, il fastidio diventa dolore e il dolore diventa infortunio. Quando si torna a correre ci si ritrova molto indietro, e la sensazione di ricominciare da zero può essere davvero demotivante. Soprattutto se si riparte senza aver capito che cosa ha portato fin lì.

I progressi si proteggono prima: dando ascolto ai primi segnali e imparando dagli errori, invece di ripeterli.

Vuoi costruire progressi che restano? Commenta PROGRESSI e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.

#correrenaturale #infortuni #allenamento #corsa #running`,
  },
  {
    id: "F9-ciclo",
    title: "Il ciclo degli infortuni",
    cover: { frame: 254, kicker: KICKER, lines: ["Il ciclo","degli infortuni"], accent: "ciclo" },
    props: {
      ...base,
      master: master("F9-ciclo"),
      segments: cut([451.79, 472.8], [479.275, 494.78]),
      tailLive: 0,
      capFrom: 3.3,
      elements: [
        { kind: "topword", at: 0.15, dur: 3.0, y: 0.53, lines: ["Tornare a correre", "il prima possibile?"], accent: "possibile?", hideCaps: true },
        { kind: "kinetic", at: 11.0, word: "cronici", dur: 2.0, words: ["Problemi", "cronici"], accentIndex: 1 },
        { kind: "loop", at: 18.9, word: "ciclo", dur: 16.9, cues: ["ciclo", "torni", "vulnerabile", "infortunarsi"], title: "Il ciclo degli infortuni", items: ["Infortunio", "Fretta", "Debolezza", "Ricaduta"] },
      ],
      cta: { word: "CICLO", title: "Vuoi uscire dal ciclo degli infortuni?" },
    },
    didascalia: `Tutti vogliono tornare a correre il prima possibile. Ed è proprio lì che comincia il ciclo degli infortuni.

Si riparte con problemi non ancora risolti e con riprese troppo affrettate: l'infortunio iniziale diventa una debolezza permanente, un punto vulnerabile che ti porti dietro a ogni uscita. Il corpo non riesce mai a recuperare davvero e ci si fa male ancora e ancora, fino al punto, per molti, di abbandonare la corsa.

Il ciclo si spezza in un solo modo: dando al corpo il tempo di recuperare e lavorando sulla causa, non solo sul sintomo.

Vuoi uscire da questo ciclo? Commenta CICLO e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.

#correrenaturale #infortuni #recupero #corsa #running`,
  },
  {
    id: "F10-investimento",
    title: "La prevenzione è un investimento",
    cover: { frame: 982, kicker: KICKER, lines: ["La prevenzione","è un investimento"], accent: "investimento" },
    props: {
      ...base,
      master: master("F10-investimento"),
      segments: cut([501.23, 525.1], [527.365, 549.98]),
      tailLive: 0.15,
      capFrom: 2.9,
      elements: [
        { kind: "topword", at: 0.1, dur: 2.75, zone: "strip", lines: ["La prevenzione", "è un investimento"], accent: "investimento", hideCaps: true },
        { kind: "stat", at: 21.3, word: "sano", dur: 2.0, value: "Molti anni", label: "sano e attivo" },
        { kind: "widget", at: 29.5, word: "imparando", dur: 6.6, cues: ["imparando", "costruendo", "allenarsi"], title: "Investire sulla tua corsa", lines: ["Imparare a correre", "Un corpo pronto per correre", "Imparare ad allenarsi"] },
        { kind: "wall", at: 40.2, dur: 6.7, hold: true, cues: ["salute", "benessere", "forma", "longevità", "libertà"], title: "Garantirà", rows: ["Salute", "Benessere", "Forma fisica", "Longevità", "Libertà"] },
      ],
      cta: { word: "INVESTO", title: "Vuoi investire sulla tua corsa?" },
    },
    didascalia: `La prevenzione è un investimento: sul tuo benessere e sulla tua longevità come corridore.

Prepararsi per evitare gli infortuni non è solo un modo per non sentire dolore: significa poter godere di uno stile di vita sano e attivo per molti anni. Investire sulla propria corsa vuol dire tre cose: imparare a correre, costruire un corpo pronto per correre e imparare ad allenarsi.

È questo che garantisce salute, benessere, forma fisica, longevità e libertà personale. Correre dovrebbe migliorare la tua vita, non limitarla.

Vuoi iniziare a investire sulla tua corsa? Commenta INVESTO e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.

#correrenaturale #prevenzione #longevita #corsa #running`,
  },
  {
    id: "F11-trentamila",
    title: "Basta infortuni",
    cover: { frame: 196, kicker: KICKER, lines: ["Basta","infortuni"], accent: "Basta" },
    props: {
      ...base,
      master: master("F11-trentamila"),
      segments: cut([139.7, 178.76]),
      tailLive: 0,
      capFrom: 3.9,
      elements: [
        { kind: "stat", at: 0.15, dur: 3.6, value: "12 anni", label: "voce fuori dal coro" },
        { kind: "kinetic", at: 7.2, word: "basta", dur: 1.2, words: ["Basta", "infortuni"], accentIndex: 0 },
        { kind: "title", at: 14.3, word: "godendo", dur: 2.8, lines: ["Solo i benefici", "della corsa"], accent: "benefici" },
        { kind: "counter", at: 26.4, word: "30.000", dur: 4.6, to: 30000, prefix: "+", label: "persone" },
        { kind: "bigstrike", at: 37.2, word: "problemi", dur: 1.9, big: true, text: "Problemi e infortuni" },
      ],
      cta: { word: "BENEFICI", title: "Vuoi solo i benefici della corsa?" },
    },
    didascalia: `Da 12 anni Daniele Vecchioni, con Correre Naturale, ripete la stessa cosa da voce fuori dal coro: basta infortuni, basta problemi legati alla corsa.

Esiste un modo per correre evitando di farsi male e godendo solo dei benefici della corsa: è quello che insegna ogni giorno ai suoi allievi e a chi si affida alla Running School e al coaching di Correre Naturale. Oramai più di 30.000 persone, che grazie alla corsa hanno preso consapevolezza del proprio corpo e hanno iniziato a ottenere risultati che non avevano mai immaginato.

Senza più problemi e senza infortuni: non è un'eccezione, è il punto di partenza.

Vuoi provarlo anche tu? Commenta BENEFICI e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.

#correrenaturale #infortuni #runningschool #corsa #running`,
  },
  {
    id: "F12-metodo",
    title: "Il metodo Correre Naturale",
    cover: { frame: 146, kicker: KICKER, lines: ["Il metodo","in tre passi"], accent: "tre passi" },
    props: {
      ...base,
      master: master("F12-metodo"),
      segments: cut([554.934, 598.84]),
      tailLive: 0.1,
      capFrom: 4.9,
      elements: [
        { kind: "nametag", at: 0.2, dur: 4.6, name: "Daniele Vecchioni", sub: "Fondatore di Correre Naturale®" },
        { kind: "journey", at: 7.7, word: "passo", dur: 15.6, cues: ["muoversi", "recupero", "allenarsi"], title: "Passo dopo passo", items: ["Muoversi bene", "Un corpo forte", "Allenarsi bene"] },
        { kind: "kinetic", at: 40.3, word: "tutta", dur: 2.6, words: ["Per tutta", "la vita"], accentIndex: 1 },
      ],
      cta: { word: "METODO", title: "Vuoi imparare il metodo?" },
    },
    didascalia: `Il metodo Correre Naturale guida le persone passo dopo passo. I passi sono tre.

Uno: imparare a muoversi correttamente, nella camminata e nella corsa. Due: investire nel recupero del proprio corpo, per renderlo forte, tonico, sano e a prova di infortuni. Tre: imparare ad allenarsi correttamente, per raggiungere qualunque obiettivo in modo sostenibile.

Daniele ha fondato Correre Naturale più di dieci anni fa proprio per questo: mettere a disposizione delle persone un metodo per imparare a correre e per poter correre senza compromessi per tutta la vita, migliorandola sotto ogni aspetto.

Vuoi partire dal primo passo? Commenta METODO e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.

#correrenaturale #metodo #infortuni #corsa #running`,
  },
  {
    id: "F13-sostenibile",
    title: "A che prezzo?",
    cover: { frame: 394, kicker: KICKER, lines: ["Più veloce:","a che prezzo?"], accent: "a che prezzo?" },
    props: {
      ...base,
      master: master("F13-sostenibile"),
      segments: cut([639.73, 643.63], [664.46, 710.2]),
      tailLive: 0,
      capFrom: 3.8,
      elements: [
        { kind: "topword", at: 0.15, dur: 3.5, y: 0.53, anim: "drop", lines: ["Risultati", "immediati?"], accent: "immediati?", hideCaps: true },
        { kind: "scale2", at: 10.1, dur: 4.9, cues: ["veloce", "velocemente"], title: "Cosa ti promettono", left: "Più veloce", right: "Il prezzo?" },
        { kind: "kinetic", at: 22.2, word: "sostenibile", dur: 1.9, words: ["Il modo", "sostenibile"], accentIndex: 1 },
        { kind: "title", at: 25.2, word: "percorso", dur: 3.4, lines: ["Un percorso", "passo dopo passo"], accent: "percorso" },
        { kind: "chips", at: 45.9, word: "risultati", dur: 4.05, cues: ["autentici", "concreti", "reali", "e"], items: ["Autentici", "Concreti", "Reali", "Duraturi"] },
      ],
      cta: { word: "SOSTENIBILE", title: "Vuoi risultati che durano?" },
    },
    didascalia: `Vogliamo tutti risultati immediati. E prevenire e prepararsi non è sexy quanto fare un personal best nel minor tempo possibile.

È quello che promettono tutti: ti faccio andare più veloce, ti faccio dimagrire più velocemente. Ma la domanda è: a che prezzo? L'unico modo reale per migliorare è quello sostenibile: un percorso che, passo dopo passo, ti fa diventare più abile, più consapevole, più forte, più resistente e anche più veloce. Senza rischiare di farti male.

La differenza è tutta qui: risultati fittizi e veloci, oppure risultati autentici, concreti e duraturi.

Vuoi scegliere i secondi? Commenta SOSTENIBILE e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.

#correrenaturale #personalbest #prevenzione #corsa #running`,
  },
  {
    id: "F14-consapevole",
    title: "Quello che quasi nessuno fa",
    cover: { frame: 70, kicker: KICKER, lines: ["Quello che","quasi nessuno fa"], accent: "quasi nessuno" },
    props: {
      ...base,
      master: master("F14-consapevole"),
      segments: cut([598.99, 639.7]),
      tailLive: 0,
      capFrom: 3.6,
      elements: [
        { kind: "topword", at: 0.15, dur: 3.4, y: 0.53, lines: ["Quello che", "quasi nessuno fa"], accent: "nessuno", hideCaps: true },
        { kind: "grid4", at: 10.6, dur: 9.4, cues: ["correre", "preparare", "ascoltarlo", "allenarsi", "consapevole"], items: ["Correre bene", "Preparare il corpo", "Ascoltarlo", "Allenarsi bene"], foot: "In modo consapevole" },
        { kind: "title", at: 29.6, word: "aumento", dur: 3.4, lines: ["Più rischio", "di farti male"], accent: "rischio" },
      ],
      cta: { word: "CONSAPEVOLE", title: "Vuoi allenarti in modo consapevole?" },
    },
    didascalia: `La corsa deve diventare uno strumento per prendersi cura di sé e per scoprire la bellezza e le capacità del proprio corpo e della propria mente.

Per riuscirci servono quattro cose: imparare a correre in modo corretto, preparare il corpo, imparare ad ascoltarlo e allenarsi in modo consapevole. È quello che la stragrande maggioranza di chi corre non fa. E chi non lo fa aumenta il rischio di farsi male, e anche quello di non arrivare mai ai livelli di salute, benessere e performance che potrebbe raggiungere.

Correre «a sensazione» non basta: la sensazione va educata.

Vuoi imparare ad ascoltare il tuo corpo? Commenta CONSAPEVOLE e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.

#correrenaturale #consapevolezza #allenamento #corsa #running`,
  },
  {
    id: "F15-rispetto",
    title: "Un atto di rispetto",
    cover: { frame: 110, kicker: KICKER, lines: ["Prevenire","è rispettarsi"], accent: "rispettarsi" },
    props: {
      ...base,
      master: master("F15-rispetto"),
      segments: cut([712.845, 751.15]),
      tailLive: 0,
      capFrom: 2.6,
      elements: [
        { kind: "title", at: 0.1, dur: 2.4, lines: ["Prevenire non è", "solo una tecnica"], accent: "tecnica" },
        { kind: "slam", at: 2.6, dur: 5.0, cues: ["modo", "rispetto"], lead: ["Un modo per dirti"], text: "Mi rispetto" },
        { kind: "kinetic", at: 13.2, word: "viaggio", dur: 2.0, words: ["Un viaggio", "di crescita"], accentIndex: 1 },
        { kind: "checklist", at: 15.8, word: "conoscerci", dur: 5.4, cues: ["conoscerci", "disciplina", "limiti"], items: ["Conoscersi", "Disciplina", "Rispettare i limiti"], big: true },
        { kind: "kinetic", at: 29.0, word: "molto", dur: 2.2, words: ["È molto", "di più"], accentIndex: 1 },
      ],
      cta: { word: "RISPETTO", title: "Vuoi prenderti cura di te correndo?" },
    },
    didascalia: `La prevenzione non è solo una tecnica: è un modo per dire a te stesso «mi rispetto, e voglio continuare a correre perché mi fa stare bene».

Non ci può essere corsa senza il rispetto per il proprio corpo. La corsa è un viaggio di crescita: insegna a conoscersi meglio, a sviluppare disciplina, a rispettare i propri limiti e a capire quali sono. Ogni passo e ogni allenamento sono un'occasione per diventare una versione migliore di sé.

Correre non è solo una questione di tempi e chilometri: è un'opportunità per prendersi cura del proprio corpo, migliorare la propria vita e sentirsi più forti, più giovani e più vivi.

Vuoi iniziare questo viaggio? Commenta RISPETTO e ti mando tutte le info sui percorsi di coaching personalizzato di Correre Naturale®.

#correrenaturale #prevenzione #rispetto #corsa #running`,
  },
];
