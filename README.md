# Eagle Eyes

An original FTC-inspired top-down shooting practice game with two selectable modes:

- **BIOBUZZ:** aim at a highlighted cell of a central Hive, with simplified wall Flowers.
- **DECODE:** aim purple Artifacts at a highlighted blue Goal, with decorative red Goal, classifiers, obelisk, and base areas.

## Play locally

Requires Python 3. Run from this directory:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. A server is needed because the JavaScript uses ES modules. No npm dependencies or build step.

## Controls

- Click the field to focus keyboard controls.
- WASD: move robot.
- Left/Right arrows: rotate heading (0° up, 90° right). Q/E also works.
- Up/Down arrows: increase/decrease shot range.
- Heading slider: set direction.
- Shot range slider: set landing distance in field units.
- Space or Shoot: fire one practice shot. Wait for it to land before shooting again.
- Touch arrow buttons: move robot on mobile.
- Reset session: restore position, aim, and statistics.

Land the preview ring inside the highlighted opening to score a hit. The session tracks hits, shots, and accuracy. Switching seasons resets the session.

The scoring opening is marked with a bright ring and SHOOT HERE callout. A diamond shows predicted landing; green ON TARGET feedback indicates a scoring shot.

## Scope

These are simplified, season-inspired field illustrations, not dimensionally accurate competition fields. Shots are a 2D landing simulation with a visual flight animation. There is no elevation, gravity, collision detection with field structures, launch-zone enforcement, intake, match timer, Hive tipping, Artifact pattern scoring, or backend. Each successful landing counts as one practice hit, not official season points. Robot movement is constrained to the perimeter only.

## Files and future work

- `index.html`: Eagle Eyes layout, season selector, controls, canvas
- `style.css`: responsive styling
- `ui.js`: field rendering, keyboard/touch input, session and flight animation
- `aim.js`: season targets, starting configurations, landing and hit calculations

Add physical field dimensions, projectile elevation, structure collisions, official season rules, or saved scores in separate modules. Replace the illustrative field coordinates in `aim.js` and `ui.js` when accurate geometry is available.

References: [DECODE official game overview](https://www.firstinspires.org/hubfs/web/program/ftc/first-age-ftc-decode-gamepostcard.pdf), [DECODE official field archive](https://ftc-resources.firstinspires.org/ftc/archive/2026/field), [BioBuzz simulator description](https://biobuzz.ncssmftc.org/lessons/). Original code and graphics; no official FIRST affiliation.
