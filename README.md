# Tempus Bellum

A phase timer for tabletop wargames (Warhammer 40k and similar), made for a phone or tablet lying on the table.
The whole app lives in `index.html`: no install needed, works offline.

## Download

Always the latest release:

- **Linux:** [Tempus-Bellum-linux-x86_64.AppImage](https://github.com/ProfGandalf/Tempus-Bellum/releases/latest/download/Tempus-Bellum-linux-x86_64.AppImage)
  (make it executable: `chmod +x Tempus-Bellum-linux-x86_64.AppImage`, then run it)
- **Windows:** [Tempus-Bellum-windows-x64.exe](https://github.com/ProfGandalf/Tempus-Bellum/releases/latest/download/Tempus-Bellum-windows-x64.exe)
  (portable, no installer; the build is unsigned, so SmartScreen may ask you to confirm with *More info → Run anyway*)

All releases: [github.com/ProfGandalf/Tempus-Bellum/releases](https://github.com/ProfGandalf/Tempus-Bellum/releases)

## Running in a browser / on a phone

- **Simplest:** open `index.html` in a browser. Everything works except offline mode and the home-screen icon.
- **As a PWA:** serve the folder over HTTP(S), e.g. `python3 -m http.server 8080`, or an nginx container on Unraid.
  Then choose “Add to Home screen” in the browser. The service worker and Wake Lock need HTTPS (or `localhost`).

## How it works

The app stores **events, not durations**. Every tap goes into a timestamped log:

| event | meaning |
|---|---|
| `phase {p, r, f}` | player `p` starts phase `f` in round `r` |
| `pause` / `resume` | time between them does not count |
| `adjust {k, d}` | manual correction of cell `k = "p\|r\|f"` by `d` ms |
| `end` | game over |

Durations are computed from the differences only when displayed, so:
- **Undo** removes the last event (time goes back to the previous phase, nothing is lost),
- **Pause** is just a pair of events,
- the raw log can be exported (JSON) and any statistics computed from it later.

State is saved to `localStorage` after every tap, so an accidental page refresh does not lose the game.
The last 50 games are kept in the history on the start screen.

## At the table

- A huge **Next phase** button (0.6 s guard against an accidental double hit with an elbow). The caption below says what comes next.
- The button takes the colour of the player whose turn it is.
- **Pause**: rules argument, coffee, lost die. While paused, the big button turns into “Resume”.
- **Table**: player × round × phase overview during the game. Tap a cell to correct a time by hand (when someone forgot to tap).
- The screen stays on (Wake Lock API in the browser, power-save blocker in the desktop app).
- Keyboard: `Space`/`Enter` = next phase, `P` = pause, `Z`/`Backspace` = undo.

For now the time counts for the player whose turn it is (including the Fight phase and opponent reactions).

## Development

```bash
npm install
npm start          # run the desktop app
npm run dist:linux # build the AppImage into dist/
npm run dist:win   # build the Windows portable .exe into dist/
```

Releasing: bump `version` in `package.json`, then push a tag such as `v0.1.0`.
The [Release workflow](.github/workflows/release.yml) builds both apps and attaches them to a GitHub release.

## Roadmap

1. ✅ MVP: player setup, phase timer, undo, pause, end-of-game table, time correction, CSV/JSON export.
2. Cross-game statistics (averages per phase, per player, trends).
3. “Chess clock” mode: switching who is currently thinking (Fight phase, Overwatch, Heroic Intervention).
