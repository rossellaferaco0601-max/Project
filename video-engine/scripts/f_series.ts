// Serie montate con il master per inquadratura (scripts/cn_master_shots.py): F = YTCN 22, G = YTCN 26.
// La cartella di lavoro (work/<video>, public/<video>, out/<video>) si ricava dal sorgente del reel.
import { REELS22 } from "../src/cn/reels22";
import { REELS26 } from "../src/cn/reels26";
export const ALL = [...REELS22, ...REELS26];
export const dirOf = (r: { props: { src: string } }) => r.props.src.split("/")[0];
