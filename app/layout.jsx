import "./globals.css";
import "@fontsource-variable/lora";
import "@fontsource-variable/caveat";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteEditor from "@/components/SiteEditor";
import BackButton from "@/components/BackButton";
export const metadata = {
  title: { default: "Sacred Falls Ayurveda and Yoga | Victoria Falls, Zimbabwe", template: "%s | Sacred Falls Ayurveda and Yoga" },
  openGraph: { images: ["/images/hero.jpg"] },
  description: "Ayurveda consultations, yoga therapy, retreats and nourishing food with Sara Norton in Victoria Falls, Zimbabwe. In person and online.",
};
export default function RootLayout({ children }) {
  return (<html lang="en"><body><Header /><BackButton /><main>{children}</main><Footer /><SiteEditor /></body></html>);
}
