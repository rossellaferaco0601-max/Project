import { AbsoluteFill, Img, staticFile } from "remotion";
import { BRAND, W } from "./types";

/** Copertina a collage (Ross 19/11, vlog lungo del workshop): sullo sfondo i fotogrammi del video in griglia, al centro un riquadro
 *  color crema con occhiello, titolo e logo Correre Naturale. Il riquadro sta dentro il ritaglio 4:5 della griglia (y 285-1635). */
export type CoverCollageProps = { tiles: string[]; cols: number; kicker: string; lines: string[]; accent?: string };

const FONT = "Blinker, sans-serif";
const H = 1920;

export const CNCoverCollage: React.FC<CoverCollageProps> = ({ tiles, cols, kicker, lines, accent }) => {
  const rows = Math.ceil(tiles.length / cols), tw = W / cols, th = H / rows, GAP = 6;
  return (
    <AbsoluteFill style={{ background: BRAND.ink, fontFamily: FONT }}>
      {tiles.map((t, i) => (
        <Img key={t} src={staticFile(t)} style={{ position: "absolute", left: (i % cols) * tw + GAP / 2, top: Math.floor(i / cols) * th + GAP / 2, width: tw - GAP, height: th - GAP, objectFit: "cover", borderRadius: 10 }} />
      ))}
      {/* velo leggero: i fotogrammi restano leggibili, il riquadro stacca */}
      <AbsoluteFill style={{ background: "rgba(11,15,10,0.22)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: BRAND.cream, borderRadius: 44, padding: "54px 64px 50px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", boxShadow: "0 24px 70px rgba(0,0,0,0.55)", border: `6px solid ${BRAND.green}` }}>
          <div style={{ background: BRAND.green, color: BRAND.cream, fontWeight: 900, fontSize: 44, letterSpacing: 4, textTransform: "uppercase", padding: "8px 30px", borderRadius: 14, marginBottom: 30 }}>{kicker}</div>
          {lines.map((l, i) => {
            const hit = accent && l.includes(accent) ? [l.slice(0, l.indexOf(accent)), accent, l.slice(l.indexOf(accent) + accent.length)] : [l, "", ""];
            return (
              <div key={i} style={{ fontWeight: 900, fontSize: 118, lineHeight: 1.0, textTransform: "uppercase", color: BRAND.ink, whiteSpace: "nowrap" }}>
                {hit[0]}<span style={{ color: BRAND.green }}>{hit[1]}</span>{hit[2]}
              </div>
            );
          })}
          {/* logo bianco usato come maschera: prende il verde del brand */}
          <div style={{ marginTop: 40, width: 520, height: 150, background: BRAND.green, WebkitMaskImage: `url(${staticFile("brand/logo-cn-orizzontale-bianco.png")})`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
