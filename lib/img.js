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

// Tiny "fingerprint" of a picture (difference hash) to spot repeats. Returns a 256-char 0/1 string or null.
export function hashUrl(url) {
  return new Promise((res) => {
    const im = new Image(); im.crossOrigin = "anonymous";
    im.onload = () => {
      try {
        const cv = document.createElement("canvas"); cv.width = 17; cv.height = 16;
        const g = cv.getContext("2d"); g.drawImage(im, 0, 0, 17, 16);
        const d = g.getImageData(0, 0, 17, 16).data; let s = "";
        for (let r = 0; r < 16; r++) for (let c = 0; c < 16; c++) { const a = (r * 17 + c) * 4, b = a + 4; s += d[a] * 0.3 + d[a + 1] * 0.59 + d[a + 2] * 0.11 > d[b] * 0.3 + d[b + 1] * 0.59 + d[b + 2] * 0.11 ? "1" : "0"; }
        res(s);
      } catch { res(null); }
    };
    im.onerror = () => res(null);
    im.src = url;
  });
}
export const hamming = (a, b) => { let n = 0; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) n++; return n; };
