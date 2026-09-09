# Gameplay Result Cards — Correct / Incorrect

Implements the two Figma screens (`node-id 174-4265` "Correct" and `174-4271`
"Incorrect") with an entrance choreography:

1. The background gradient fades/scales in, then continuously breathes
   (the color-stop position drifts slowly) for a living feel.
2. The headline ("Correct!" / "Incorrect!") reveals **letter by letter**,
   each character masked by an overflow-hidden box whose inner span slides
   down from being clipped above, staggered ~45ms per letter.
3. The white feature card slides up and fades in, overlapping the tail end
   of the letter reveal.
4. The "Swipe to continue" prompt fades up last.

Use the pill controls under the card to switch between Correct/Incorrect
and replay the entrance animation.

## Run locally

```bash
npm install
npm run dev
```

## Import into CodeSandbox

Pick whichever is easiest:

- **Drag & drop**: go to https://codesandbox.io/dashboard, click
  "Create Sandbox" → "Import Folder", and drop this project folder in
  (or its zip).
- **From GitHub**: push this folder to a GitHub repo, then open
  `https://codesandbox.io/s/github/<your-org>/<your-repo>`.
- **CodeSandbox CLI**: from this folder run `npx codesandbox .`, which
  uploads the project and opens it in the browser.

## Notes

- The status bar from the Figma frame is `opacity: 0` in the design
  (a device-mock artifact), so it's rendered here as an invisible
  spacer purely to preserve the original layout spacing.
- The "swipe" icon is inlined as SVG (`src/SwipeIcon.jsx`) rather than
  linked to Figma's temporary asset URL, since those expire after ~7 days.
- Headline/body fonts use Poppins/Inter (Google Fonts) as close, freely
  licensed stand-ins for the design's Google Sans Flex / Google Sans Text.
