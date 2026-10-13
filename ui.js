// UI feedback only. No movement, physics, timer, scoring, or backend logic.
for (const name of ['angle', 'power']) {
  const input = document.getElementById(name);
  const output = document.getElementById(`${name}Value`);
  input.addEventListener('input', () => {
    output.value = `${input.value}${name === 'angle' ? '°' : '%'}`;
  });
}
// Future integration: replace .arena SVG with a renderer; bind #angle/#power;
// enable and bind #start/#shoot/#reset; update #score/#time/#accuracy/#status.
// Keep movement and physics in separate game modules.
