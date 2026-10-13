# Eagle Eyes — Target Blitz

A 30-second robot-shooter arcade challenge. BIOBUZZ **Pollen Pop** and DECODE **Artifact Hunt** are themed arenas, not official FTC field simulations.

## Play locally

Run `python3 -m http.server 8000` in the project folder, open http://localhost:8000, and click **Start Target Blitz**. No dependencies or build step.

## Controls

- WASD: move
- Left/Right arrows (or Q/E): aim
- Up/Down arrows: shot range
- Sliders: heading and range
- Space or Shoot: fire; one ball in flight at a time
- Touch arrows: move

## New game loop

A target appears at a random location, at least 140 units from the robot and 170 from the previous target. A glowing countdown ring shows its remaining life. Hit it before it expires to spawn another target. Expired targets reset your combo and increment the escaped count.

The dashed trajectory and crosshair preview where your shot will land. Green means your landing point fits inside the target. The shooter is manual: movement, heading, and range remain under your control.

Targets begin with 5.5 seconds of life and become 0.15 seconds faster per hit, down to 3 seconds. Their radius shrinks from 35 to 23 units as hits accumulate. Hits earn 100 base points plus a speed bonus up to 100, multiplied by the combo. Consecutive hits within 3 seconds increase the combo up to ×5. Misses, target expiry, or a 3-second gap break the combo.

Shots must land before the target expires and before the 30-second buzzer. A shot aimed at a target that has since expired cannot score on its replacement. Switching themes or resetting clears the session.

## Files

- `index.html`: interface and counters
- `style.css`: responsive styles
- `ui.js`: rendering, input, round, target lifecycle, scoring
- `targets.js`: random placement and difficulty
- `aim.js`: shooter calculations and starting settings

This is a simplified 2D landing simulation. Elevation physics, structure collisions, intakes, official season rules, and backend are not implemented. Original code and graphics, no official FIRST affiliation.
