/* Draws the rose / flower / leaf clusters for the four corners */
(function () {
  const P = (a) => a.map((n) => +n.toFixed(1)).join(" ");
  const pal = { red: { edge: "#6d0a2c" }, pink: { edge: "#b03a63" } };

  const defs = `<defs>
    <radialGradient id="redPetal" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#ff6584"/><stop offset=".5" stop-color="#d81b4a"/><stop offset="1" stop-color="#85102f"/></radialGradient>
    <radialGradient id="pinkPetal" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#fff0f5"/><stop offset=".5" stop-color="#ff9dbb"/><stop offset="1" stop-color="#d9648c"/></radialGradient>
    <linearGradient id="leafG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2f5a35"/><stop offset="1" stop-color="#6f9c58"/></linearGradient>
    <radialGradient id="daisy" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#ffd3e2"/></radialGradient>
  </defs>`;

  function rose(x, y, r, c) {
    const edge = pal[c].edge;
    let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="${edge}"/>`;
    const rings = [
      { n: 7, d: 0.66, s: 0.46, o: 0 }, { n: 6, d: 0.5, s: 0.42, o: 25 },
      { n: 5, d: 0.34, s: 0.36, o: 50 }, { n: 4, d: 0.2, s: 0.3, o: 10 }, { n: 3, d: 0.08, s: 0.22, o: 70 },
    ];
    rings.forEach((k) => {
      for (let i = 0; i < k.n; i++) {
        const a = k.o + (i * 360) / k.n, rad = (a * Math.PI) / 180;
        const px = x + Math.cos(rad) * r * k.d, py = y + Math.sin(rad) * r * k.d;
        s += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(r * k.s).toFixed(1)}" ry="${(r * k.s * 0.78).toFixed(1)}"
          transform="rotate(${a + 90} ${px.toFixed(1)} ${py.toFixed(1)})" fill="url(#${c}Petal)" stroke="${edge}" stroke-opacity=".55" stroke-width="1"/>`;
      }
    });
    s += `<path d="M${P([x - r * .12, y])} a${P([r * .12, r * .12])} 0 1 1 ${P([r * .12, r * .12])}" fill="none" stroke="${edge}" stroke-width="1.4" opacity=".7"/>`;
    s += `<ellipse cx="${x - r * .3}" cy="${y - r * .38}" rx="${r * .3}" ry="${r * .14}" fill="#fff" opacity=".18" transform="rotate(-35 ${x - r * .3} ${y - r * .38})"/>`;
    return s;
  }

  function leaf(x, y, len, ang) {
    const w = len * 0.34;
    return `<g transform="translate(${x} ${y}) rotate(${ang})">
      <path d="M0 0 Q${len * .5} ${-w} ${len} 0 Q${len * .5} ${w} 0 0Z" fill="url(#leafG)" stroke="#264a2b" stroke-width=".8"/>
      <path d="M2 0 L${len * .92} 0 M${len * .3} 0 l${len * .18} ${-w * .5} M${len * .3} 0 l${len * .18} ${w * .5} M${len * .55} 0 l${len * .15} ${-w * .4} M${len * .55} 0 l${len * .15} ${w * .4}" stroke="#a8cf8f" stroke-opacity=".55" stroke-width=".9" fill="none"/></g>`;
  }

  function daisy(x, y, r, rot) {
    let s = "";
    for (let i = 0; i < 5; i++) {
      const a = rot + i * 72, rad = (a * Math.PI) / 180;
      const px = x + Math.cos(rad) * r * 0.55, py = y + Math.sin(rad) * r * 0.55;
      s += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${r * .5}" ry="${r * .36}" transform="rotate(${a} ${px.toFixed(1)} ${py.toFixed(1)})" fill="url(#daisy)" stroke="#f3a9c2" stroke-width=".8"/>`;
    }
    return s + `<circle cx="${x}" cy="${y}" r="${r * .22}" fill="#ffc94d"/>`;
  }

  const vine = (d, w = 3) => `<path d="${d}" fill="none" stroke="#3b6a3f" stroke-width="${w}" stroke-linecap="round"/>`;
  const bud = (x, y, a) => `<g transform="translate(${x} ${y}) rotate(${a})"><ellipse cx="0" cy="0" rx="6" ry="10" fill="url(#pinkPetal)" stroke="#b03a63" stroke-width=".8"/><path d="M-6 6 Q0 -2 6 6 Q0 12 -6 6Z" fill="#3b6a3f"/></g>`;

  const cluster = `<svg viewBox="0 0 300 300" aria-hidden="true">
    ${vine("M-5 150 C50 140 90 100 170 95 S260 60 305 15")}
    ${vine("M60 -5 C70 60 110 110 150 150 S200 230 215 305", 2.5)}
    ${vine("M-5 235 C40 215 80 220 120 200", 2)}
    ${leaf(95, 120, 60, 25)}${leaf(150, 88, 55, -35)}${leaf(210, 62, 50, -20)}${leaf(20, 205, 58, 20)}
    ${leaf(125, 175, 52, 70)}${leaf(165, 200, 50, 55)}${leaf(235, 30, 45, -55)}${leaf(85, 20, 48, 70)}${leaf(28, 128, 50, -50)}
    ${daisy(235, 95, 18, 10)}${daisy(115, 240, 16, 30)}${daisy(255, 40, 13, 50)}${daisy(20, 262, 15, 0)}${daisy(190, 150, 14, 20)}
    ${bud(275, 75, 30)}${bud(160, 255, -10)}${bud(48, 285, 50)}
    ${rose(72, 72, 70, "red")}
    ${rose(175, 52, 44, "pink")}
    ${rose(52, 178, 46, "pink")}
    ${rose(145, 130, 34, "red")}
    ${leaf(105, 60, 42, -15)}${leaf(20, 100, 40, 80)}${leaf(178, 108, 36, 40)}
  </svg>`;

  document.body.insertAdjacentHTML("afterbegin", `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${defs}</svg>`);
  window.Flowers = { rose, leaf, daisy };
  document.querySelectorAll(".corner").forEach((el) => el.insertAdjacentHTML("afterbegin", cluster));
})();
