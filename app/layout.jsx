import "./globals.css";
import "@fontsource-variable/lora";
import "@fontsource-variable/caveat";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteEditor from "@/components/SiteEditor";
import BackButton from "@/components/BackButton";
import Schema from "@/components/Schema";
const base = "https://www.sacredfallsayurveda.com";
export const metadata = {
  metadataBase: new URL(base),
  title: { default: "Ayurveda & Yoga Therapy Victoria Falls | Sacred Falls", template: "%s | Sacred Falls" },
  description: "Ayurveda consultations, yoga therapy, traditional treatments and wellness retreats with Sara Norton in Victoria Falls, Zimbabwe. In person and online.",
  alternates: { canonical: "./" },
  openGraph: { type: "website", siteName: "Sacred Falls Ayurveda and Yoga", locale: "en", images: [{ url: "/images/hero.jpg" }] },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({ children }) {
  return (<html lang="en"><body><Header /><BackButton /><main>{children}</main><Footer /><SiteEditor /><Schema /></body></html>);
}
