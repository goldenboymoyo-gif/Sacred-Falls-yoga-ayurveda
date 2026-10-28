import Link from "next/link";
import ReadMore from "@/components/ReadMore";
import PageHead from "@/components/PageHead";
import Events from "@/components/Events";
import Fig from "@/components/Fig";
export const metadata = { title: "Retreats, Workshops & Events", description: "Ayurveda and yoga retreats and workshops worldwide, with optional African safari experiences." };
export default function Page() {
  return (<>
    <PageHead eyebrow="Retreats" title="Retreats, Workshops and Shared Learning" />
    <section><div className="wrap split">
     <ReadMore>
      <p>Sacred Falls Ayurveda and Yoga offers retreats and workshops held within Zimbabwe and worldwide, creating time and space to step away from daily life and return to what is essential.</p>
      <p>Each experience brings together Ayurveda, yoga, yoga therapy, nourishing food, meditation, nature and meaningful connection.</p>
      <p>Selected retreats can also be combined with unforgettable safari experiences, immersed in the wilderness, wildlife and natural beauty of Africa.</p>
      <p>These gatherings offer an opportunity to rest, learn and reconnect with yourself, with others and with the living world around you. You will leave with practical tools and inspiration to carry into everyday life.</p>
     </ReadMore>
     <div className="pair stack"><Fig src="/images/retreat-lawn.jpg" cap="A small group gathered on the lawn" /><Fig src="/images/bowls.jpg" cap="Brass singing bowls used in relaxation" /></div>
    </div></section>
    <section className="alt"><div className="wrap split rev">
     <ReadMore>
      <h2>Upcoming Offerings</h2>
      <Events />
      <p style={{ marginTop: "1.2rem" }}>Dates and details are shared as they are confirmed. Get in touch to hear first.</p>
      <Link className="btn" href="/contact#book">Enquire about upcoming events</Link>
     </ReadMore>
     <Fig src="/images/waterfall.jpg" cap="Yoga beside the spray of the Victoria Falls" />
    </div></section>
  </>);
}
