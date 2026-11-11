import Link from "next/link";
import ReadMore from "@/components/ReadMore";
import PageHead from "@/components/PageHead";
import Events from "@/components/Events";
import Fig from "@/components/Fig";
export const metadata = { title: "Ayurveda and Yoga Retreats and Wellness Safaris", description: "Ayurveda and yoga immersion retreats and wellness safari experiences with Sara Norton, in Zimbabwe and worldwide. Examples, what is included and how to enquire." };
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
    <section id="immersion"><div className="wrap narrow">
      <span className="eyebrow">Ayurveda and yoga</span>
      <h2>Immersion retreats</h2>
      <p>A few days set apart to rest, learn and reconnect. Ayurveda, yoga, yoga therapy, meditation, nourishing food and time in nature, in a small group.</p>
      <dl className="facts">
        <div><dt>Where</dt><dd>Within Zimbabwe and worldwide. The location is confirmed for each retreat.</dd></div>
        <div><dt>How long</dt><dd>Confirmed for each retreat.</dd></div>
        <div><dt>What is included</dt><dd>Ayurveda teaching and personal guidance, yoga and meditation, yoga therapy, and food from the tri-dosha balanced recipes in our recipe book, From Our Kitchen. Accommodation and other inclusions are listed with each retreat.</dd></div>
      </dl>
      <div className="example">
        <strong>Example itinerary (illustration only, not a confirmed programme)</strong>
        <ul className="list">
          <li>Morning: gentle yoga and breathwork</li>
          <li>Late morning: Ayurveda talk or workshop on food, digestion or daily rhythm</li>
          <li>Midday: shared, nourishing meal</li>
          <li>Afternoon: rest, time in nature or an individual session</li>
          <li>Evening: yoga therapy, meditation and quiet reflection</li>
        </ul>
      </div>
      <div className="row"><Link className="btn" href="/contact#book">Enquire about retreats</Link></div>
    </div></section>
    <section className="alt" id="safari"><div className="wrap narrow">
      <span className="eyebrow">Wellness and wilderness</span>
      <h2>Wellness safari experiences</h2>
      <p>Selected retreats can be combined with unforgettable safari experiences, immersed in the wilderness, wildlife and natural beauty of Africa.</p>
      <dl className="facts">
        <div><dt>Where</dt><dd>Zimbabwe and the surrounding region. Confirmed for each experience.</dd></div>
        <div><dt>How long</dt><dd>Confirmed for each experience.</dd></div>
        <div><dt>What is included</dt><dd>Listed with each experience once it is confirmed.</dd></div>
      </dl>
      <div className="example">
        <strong>Example (illustration only, dates not confirmed)</strong>
        <p>A retreat of yoga, Ayurveda and nourishing food followed by a few days on safari, with gentle morning practice before game drives.</p>
      </div>
      <div className="row"><Link className="btn" href="/contact#book">Enquire about retreats and safaris</Link></div>
    </div></section>
    <section id="enquire"><div className="wrap split rev">
     <ReadMore>
      <h2>Upcoming Offerings</h2>
      <Events />
      <p style={{ marginTop: "1.2rem" }}>Dates and details are shared as they are confirmed. Get in touch to hear first.</p>
      <Link className="btn" href="/contact#book">Enquire about upcoming events</Link>
     </ReadMore>
     <Fig src="/images/waterfall.jpg" cap="Yoga beside the spray of the Victoria Falls" />
    </div></section>
    <section className="alt"><div className="wrap narrow"><p className="related">Related: <Link className="textlink" href="/ayurveda">Ayurveda consultations</Link> · <Link className="textlink" href="/yoga-therapy">Yoga Therapy</Link> · <Link className="textlink" href="/treatments">Treatments</Link> · <Link className="textlink" href="/food">Food and recipes</Link></p></div></section>
  </>);
}
