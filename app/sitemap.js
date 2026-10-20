export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  return ["", "/ayurveda", "/yoga-therapy", "/food", "/retreats", "/gallery", "/about", "/contact"].map((p) => ({ url: base + p }));
}
