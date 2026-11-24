# Developing Wizkinews

Requires Node.js 20.19+ (or a newer supported LTS).

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://127.0.0.1:5173/`.
Run `npm run build` for a production build, or `npm run preview` to preview it.

`src/main.jsx` renders the logo, subtitle, and animated character layers.
`src/styles.css` handles the layout, logo hover, and repeating arm animation.
There are no scroll listeners or sticky sections.

The arm rotates around `(792.5, 792.5)` on the 1000 × 1200 WebP canvas,
expressed as `transform-origin: 79.25% 66.041667%`. Change the `wave` keyframes
or its `2.8s` duration to adjust the motion.
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

## Embedded game

`GameEmbed` in `src/main.jsx` places the Godot game between the final marquee and
the placeholder section, separated from the marquee by some space.
A black Speed Balls title tab joins the top-left of the thin, rounded black frame.
A black description tab joins the bottom-right of the frame, with brief white text.
The game stays centered and responsive against the blue page background.
**Play** mounts the iframe and starts the download. **Stop game**
ends the current session and removes the iframe so the browser can reclaim the
runtime resources. The game controls fullscreen from inside the iframe.

The game files live in `public/games/multi-grappler/`. Its loading screen is
generated from `web/custom_shell.html` in the **multi_grappler game repository**.
Edit that template and re-export from Godot for permanent loading-screen changes.
Keep startup canvas focus disabled so the iframe does not scroll the homepage
when it finishes loading.

To test a threaded build, enable **Variant → Thread Support** in the Godot Web
export preset and re-export the full build. Vite dev and preview send the
cross-origin isolation headers required by the threaded build on loopback.
On GitHub Pages, the homepage registers a root-scoped service worker that adds
`Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: require-corp` to the homepage and game responses.
It may reload the homepage on the first visit. Open the deployed site over
HTTPS in a fresh browser profile, click **Play**, and check that
`window.crossOriginIsolated` is `true` in the homepage and game document. See
[Godot’s Web export requirements](https://docs.godotengine.org/en/4.3/tutorials/export/exporting_for_web.html#serving-the-files).

The worker and its MIT license come from
[coi-serviceworker v0.1.7](https://github.com/gzuidhof/coi-serviceworker/tree/7b1d2a092d0d2dd2b7270b6f12f13605de26f214).

## Web asset exports and loading

The page imports optimized exports from `assets/web/`; keep the original PNGs
and TTF for future edits. To regenerate the exports after changing the artwork:

```sh
python -m pip install pillow fonttools brotli
python scripts/optimize-assets.py
```

The six waving-character layers are resized to 1000 pixels wide, then cropped
to the top 1200 rows to skip transparent padding and keep the layers aligned. The
marquee exports are at most 860 pixels tall (688 for the smaller characters),
roughly twice their maximum CSS display height. Artwork uses lossless WebP;
the sky uses separate mobile and desktop WebP exports selected in CSS.
The favicon has a dedicated 64 × 64 export.

The font is a Latin WOFF2 subset with extended Latin, punctuation, and currency
symbols. For other writing systems, extend the Unicode ranges in the export
script or add a separate font face. `font-display: swap` keeps text visible.

The hero fades in after its layers finish loading and decoding. Both copies of
the character marquee start loading within 200 pixels of the viewport and
decode before the marquee fades in and starts moving. The strip keeps its layout
height and shows a loading message while waiting. Failed images show an
artwork-unavailable placeholder without blocking the animation. Reduced-motion
preferences disable the fades and motion. The footer images use lazy loading.

For production loading checks, run `npm run build` and then `npm run preview`.
Test on a slow connection and let the character strip loop at least twice;
the second group should contain the same fully loaded images as the first.
