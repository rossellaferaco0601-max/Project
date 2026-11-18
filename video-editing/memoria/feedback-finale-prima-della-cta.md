---
name: feedback-finale-prima-della-cta
description: "Prima della CTA non si deve mai vedere la mossa/inquadratura successiva di Daniele, né un fermo immagine, né uno stacco netto; l'ultima grafica esce prima"
metadata:
  node_type: memory
  type: feedback
  modified: 2026-11-18
---

Ross, 17 e 18/11/2026 (serie F, YTCN 22). Prima su F1 («quello stacco strano prima della CTA, devi renderlo più fluido»), poi su F4
(«prima della CTA c'è un taglio strano, non si deve vedere la mossa successiva di Daniele, è una cosa che ti ho detto mille volte, c'è
sempre lo stesso errore») e su F7 e F11 («c'è uno stacco troppo netto prima della CTA»).

**Why:** il finale è il punto in cui chi guarda decide se leggere la CTA: un salto di posa, un fotogramma bloccato o una grafica coperta
a metà sembrano errori di montaggio. È la correzione che Ross ripete più spesso insieme al volto libero. (Interpretazione mia: «mossa
successiva» = l'inquadratura o la posa che nel video di partenza viene dopo l'ultima frase del reel, anche quando lo stacco dell'originale
cade a metà dell'ultima parola.)

**How to apply:**
- Negli ultimi ~2,5 s non deve restare uno stacco del video di partenza. Se l'ultima frase finisce dopo uno stacco dell'originale, quel
  pezzo NON si mostra: lo si copre con una grafica a tutto schermo che resta finché la CTA la copre (F4: il conto intero), oppure
  si chiude prima. La dissolvenza verso la posa successiva non basta (F4 v1 bocciato).
- Niente fermo immagine: coda che continua a muoversi (`ping` in `cn_master_shots.py`) e CTA che parte ~0,3 s dopo l'ultima parola
  (`tailSeconds 0.8`, `tailHold 0.3`).
- L'ultima grafica deve essere uscita prima che la CTA cominci a salire (F11: la frase barrata veniva coperta a metà).
- Controllo prima di consegnare: fotogrammi degli ultimi 2,5 s di OGNI reel, uno ogni 3, più la differenza tra fotogrammi della coda
  (una fila di zeri = fermo immagine).
