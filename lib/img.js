// High-quality JPEG export that still fits the host's ~4.5 MB request limit.
export const MAXPX = 2600;
export function exportCanvas(c) {
  let cv = c, q = 0.93, d = cv.toDataURL("image/jpeg", q);
  while (d.length > 4.1e6) {
    if (q > 0.72) q -= 0.07;
    else { const n = document.createElement("canvas"); n.width = Math.round(cv.width * 0.85); n.height = Math.round(cv.height * 0.85); n.getContext("2d").drawImage(cv, 0, 0, n.width, n.height); cv = n; }
    d = cv.toDataURL("image/jpeg", q);
  }
  return d;
}
export function shrinkFile(file, max = MAXPX) {
  return new Promise((res, rej) => {
    const im = new Image(), u = URL.createObjectURL(file);
    im.onload = () => {
      const k = Math.min(1, max / Math.max(im.width, im.height)); const cv = document.createElement("canvas");
      cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
      const g = cv.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(im, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(u); res(exportCanvas(cv));
    };
    im.onerror = () => { URL.revokeObjectURL(u); rej(new Error("Could not read that image")); };
    im.src = u;
  });
}
