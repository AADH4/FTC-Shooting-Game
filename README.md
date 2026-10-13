# Eagle Eyes — Eagle Rush

A 30-second FTC-inspired aiming challenge with BIOBUZZ and DECODE modes.

## Play

Run `python3 -m http.server 8000` from the project folder and open http://localhost:8000. No installation or build required. Click **Start 30-second rush**.

- WASD moves the robot.
- Left/Right arrows rotate aim; Q/E also works.
- Up/Down arrows adjust shot range; sliders also work.
- Space or Shoot fires. One shot at a time, about 0.4 seconds in flight.
- Reset session returns to the ready screen.

## Eagle Rush rules

You have 30 seconds. Land in the bright **SHOOT HERE** opening to score. BIOBUZZ alternates between two Hive cells; DECODE alternates blue and red Goals. These switches are an arcade challenge mechanic, not official season rules.

Each hit earns 100 points multiplied by your combo. Consecutive hits within three seconds increase the combo up to ×5. A miss or three seconds without a hit breaks the combo. The buzzer cancels any in-flight shot; it still counts as an attempt. Switching seasons resets the round.

There is no exact landing preview or numeric heading-error hint. A short ray shows your heading; use target distance and the field to judge range. Misses report distance from the target after landing.

## Scope and future work

Original, simplified top-down layouts, not to-scale official fields. Shooting is a 2D landing calculation with a visual flight animation. Elevation physics, structure collisions, intakes, official launch zones, Hive tipping, Artifact pattern scoring, and backend are not implemented. Robot movement is limited by the perimeter only.

- `index.html`: interface, round clock, season selector
- `style.css`: responsive styles
- `ui.js`: rendering, input, timed round, target switching, combos
- `aim.js`: starting settings and shot calculations

Original graphics and code; no official FIRST affiliation.
