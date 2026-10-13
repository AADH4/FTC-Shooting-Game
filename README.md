# FTC Shooting Game — UI starter

A responsive layout for a robot basket shooting game. UI only: a static field illustration, robot and basket, scoreboard, aim sliders, and disabled round buttons. Sliders update their labels. Movement, shooting, physics, scoring, timer, and backend are left for future work.

## Preview

Open `index.html` in a browser. No installation or build needed.

## Files

- `index.html`: structure, static SVG field, controls, scoreboard
- `style.css`: responsive layout and visual styles
- `ui.js`: slider label feedback and integration notes

## Add logic later

Replace the SVG inside `.arena` with your game renderer. Bind `angle` and `power` to the shooter. Enable `start`, `shoot`, and `reset` when their handlers exist. Update `score`, `time`, `accuracy`, and `status` from game state. Keep movement and physics in separate modules.

Planned controls: A/D movement and Space shooting. Planned objective: as many baskets as possible in 60 seconds. Neither is implemented yet.

Use a feature branch and pull request for teammate review. Suggested future tasks: movement, projectile physics, basket detection, and round timing.

Original graphics and code. No official FTC affiliation.
