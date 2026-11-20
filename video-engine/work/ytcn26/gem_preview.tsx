// Foglio di controllo delle illustrazioni scritte da Gemini (src/cn/gem): una pagina per istante.
// Uso: npx tsx work/ytcn26/gem_preview.tsx GemLayers cartella '{"stage":2,"cue":0.4,"fx":[1.4,2.6]}' 0.3,0.9,1.6
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import fs from "fs";
const [, , name, out, propsJson, tsCsv, tag] = process.argv;
const C = require(`../../src/cn/gem/${name}`)[name];
const ts = (tsCsv ?? "0.3,0.9,1.6,2.4,3.3,4.5").split(",").map(Number);
fs.mkdirSync(out, { recursive: true });
ts.forEach((t, i) => fs.writeFileSync(`${out}/${name}${tag ?? ""}_${i}.html`, `<body style="background:#1c241b;margin:0;padding:10px"><div style="color:#fff;font:16px sans-serif">${name} t=${t}</div>${renderToStaticMarkup(<C t={t} uid="p" {...JSON.parse(propsJson ?? "{}")} />)}</body>`));
