export default function robots() {
  const open = { allow: "/", disallow: ["/admin"] };
  const bots = ["Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot"];
  return { rules: [{ userAgent: "*", ...open }, ...bots.map((userAgent) => ({ userAgent, ...open }))], sitemap: "https://www.sacredfallsayurveda.com/sitemap.xml" };
}
