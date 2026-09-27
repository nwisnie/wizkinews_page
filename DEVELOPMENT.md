# Developing Wizkinews

Requires Node.js 20.19+ (or a newer supported LTS).

```sh
npm install
npm run dev
```

Run `npm run build` for a production build, or `npm run preview` to preview it.

`src/main.jsx` renders the logo, subtitle, and animated character layers.
`src/styles.css` handles the layout, logo hover, and repeating arm animation.
There are no scroll listeners or sticky sections.

Both character PNGs use their original 2000 × 4050 canvases. The arm rotates
around `(1585, 1585)`, expressed as `transform-origin: 79.25% 39.135802%`.
Change the `wave` keyframes or its `4s` duration to adjust the motion.
Reduced-motion preferences disable the arm and hover animations.

The character blinks every 2.5–6 seconds, closing its eyes for 110–180 ms.
Gaze changes every 1.8–4.2 seconds while the eyes are open. The left pupil moves
up to 9 source pixels horizontally and 3 vertically; the right moves twice as far.
The eye-whites image masks the pupils so they stay inside the eyes. Eye layers
sit behind the arm. Timers are cleaned up on unmount and disabled for reduced motion.

The sky background scales to the page width without repeating. The page background
color (`--page-background` in `src/styles.css`) is `#8ebce5`, sampled from the
bottom edge of `bg_sky.png`, so content below the image blends into solid blue.

## Asset folders

- `assets/images/branding/`: the Wizkinews logo.
- `assets/images/backgrounds/`: the sky and logo backdrop.
- `assets/images/character/`: body, arm, and eye layers.
- `assets/source/`: editable artwork (`.kra`).
- `assets/backups/`: existing image and artwork backups (`~` files).

Replace images in these folders when updating artwork; imports in `src/main.jsx`
and background URLs in `src/styles.css` point here.

The sections below the title card use `assets/images/characters/`, grouped by
character. `computer-rock` rotates the computer ±3 degrees every 4 seconds.
The gallery uses original canvas sizes to align its layers: legs stay still and
all upper layers move together by 1% every 3.5 seconds, with staggered phases.
These animations also respect reduced-motion preferences.
