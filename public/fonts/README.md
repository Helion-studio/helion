# Custom display fonts

The spec calls for **Nevera** (or **Varino**) for the wordmark and headline.
Both are commercial fonts — they can't be redistributed, so they are not bundled.

To activate:

1. Buy/download the font and export a `.woff2`.
2. Drop it here as `Nevera.woff2` (and optionally `Nevera-Bold.woff2`).
3. Uncomment the `@font-face` block at the bottom of `src/app/globals.css`.

Everything using `font-display` (headline + "Helion Team" wordmark) picks it up
automatically. Until then it falls back to **Geist**, which is the closest free
geometric grotesk.
