import PageHead from "@/components/PageHead";
import Gallery from "@/components/Gallery";
export const metadata = { title: "Gallery", description: "Photos of yoga, Ayurveda treatments, consultations and gatherings at Sacred Falls Ayurveda and Yoga." };
export default function Page() {
  return (<>
    <PageHead eyebrow="A look inside" title="Gallery">Moments from yoga sessions, Ayurvedic treatments, consultations and gatherings in the garden.</PageHead>
    <section style={{ paddingTop: 20 }}><div className="wrap"><Gallery /></div></section>
  </>);
}
