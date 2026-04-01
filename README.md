# Taco-Rex

Taco-Rex is a 2D browser arcade game made with vanilla JavaScript and Canvas.
You control a T-Rex that dodges obstacles and collects tacos while speed increases over time.

This repository is part of my frontend portfolio and reflects both the original idea and a modernized pass focused on code quality, performance, and user experience.

https://montseortiz.github.io/Taco-Rex/

## Installation

1. Clone the repository:

```bash
git clone https://github.com/MontseOrtiz/Taco-Rex.git
```

2. Open the project directory:

```bash
cd Taco-Rex
```

3. Run a local static server (recommended):

```bash
python3 -m http.server 5173
```

4. Open `http://localhost:5173` in your browser.

You can also open `index.html` directly, but a local server is better for predictable asset loading.

## Usage

- Click `Jugar` or press `Enter` to start a run.
- Move with arrow keys.
- Press `P` to pause/resume.
- Avoid obstacles and collect tacos to increase your taco counter.

## Scripts

This project uses no bundler and has no npm scripts yet.

Useful local command:

```bash
python3 -m http.server 5173
```

## Stack

- HTML5
- CSS3
- JavaScript (ES5/ES6 style mix)
- Canvas 2D API
- Browser Audio API

## Basic Structure

```text
.
├── index.html          # App shell and game container
├── style.css           # Layout and visual style
├── main.js             # Game loop, entities, collisions, controls
├── Imagenes/           # Sprites and backgrounds
└── Audio/              # Music and SFX
```

## What Was Improved

- Replaced `setInterval` with `requestAnimationFrame` + fixed timestep loop.
- Split game cycle into clear `update()` and `render()` stages.
- Added state handling for `idle`, `playing`, `paused`, and `gameover`.
- Fixed difficulty progression condition order.
- Removed per-frame debug logs.
- Added cleanup of offscreen entities to prevent unnecessary memory growth.
- Updated keyboard handling using modern key detection.
- Refreshed UI styles for a more portfolio-ready look while preserving the original vibe.


## License

Personal portfolio / educational use.
