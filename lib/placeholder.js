// Shown when a studio image URL is broken
export const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b1446"/><stop offset="1" stop-color="#3b1d6e"/></linearGradient></defs><rect width="800" height="500" fill="url(#g)"/><circle cx="400" cy="250" r="54" fill="none" stroke="#22d3ee" stroke-width="6"/><circle cx="400" cy="250" r="20" fill="#22d3ee"/><text x="400" y="360" text-anchor="middle" fill="#a5b4fc" font-family="sans-serif" font-size="26">No image available</text></svg>`
  );

export const onImgError = (e) => {
  if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
};