# Dice sounds

The app plays a short **tap** then a **roll/tumble** when you roll (if sound is on in Settings).

| File | Role |
|------|------|
| `dice-roll.mp3` | Main dice rolling / tumbling on a surface |
| `dice-tap.mp3` | Short initial hit (optional; roll still works if only `dice-roll.mp3` loads) |

Replace these with your own **realistic dice** recordings (MP3, ~0.2–1.5s). Keep filenames the same, or update `src/hooks/useDiceSound.ts`.

**Tips for realistic SFX:** several dice on felt or wood, one clean recording; avoid music or voice.

Current bundled clips are from [Mixkit](https://mixkit.co/) (free license).
