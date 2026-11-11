import Link from "next/link";
import ReadMore from "@/components/ReadMore";
import PageHead from "@/components/PageHead";
import Fig from "@/components/Fig";
export const metadata = { title: "Yoga Therapy in Zimbabwe", description: "Private yoga therapy sessions with Sara Norton in Victoria Falls, Zimbabwe, adapted to your needs, experience and capacity. What to expect and how to book." };
export default function Page() {
  return (<>
    <PageHead eyebrow="Yoga" title="Yoga Therapy" />
    <section><div className="wrap split">
     <ReadMore>
      <p>Yoga Therapy uses the wisdom and practices of yoga to support individual wellbeing. Sessions are adapted to your needs, experience and capacity, using poses, breath, relaxation, meditation and mudras. Sara will create an individual protocol for private, personal practise to alleviate stresses on the body, mind and spirit.</p>
      <p>She can teach individual classes or adapt to your personal need to balance your body, mind and spirit, integrated within the recommendations for your Ayurvedic imbalances and requirements.</p>
      <p>Yoga therapy is very personal and meant to teach you to form your own independent practise.</p>
      <Link className="btn" href="/contact#book">Book a yoga therapy session</Link>
     </ReadMore>
     <div className="pair stack"><Fig src="/images/boat.jpg" cap="Boat pose, strengthening the core" /><Fig src="/images/smoke.jpg" cap="Incense burner held over a guided relaxation" /></div>
    </div></section>
    <section className="alt" id="expect"><div className="wrap narrow">
      <h2>What to expect</h2>
      <dl className="facts">
        <div><dt>What is included</dt><dd>A private session using poses, breath, relaxation, meditation and mudras, chosen for you and linked to your Ayurvedic recommendations where relevant.</dd></div>
        <div><dt>Who it suits</dt><dd>You do not need any yoga experience. Sessions are adapted to your needs and capacity. Yoga therapy supports, and does not replace, medical care. Please tell Sara about any injuries or health conditions when you book.</dd></div>
        <div><dt>Follow-up</dt><dd>You can return for further sessions to refine your practice, so that you can form your own independent practice.</dd></div>
        <div><dt>Length and cost</dt><dd>Confirmed with you when you enquire.</dd></div>
        <div><dt>How to enquire</dt><dd>Use the <Link className="textlink" href="/contact#book">booking form</Link>, or call or WhatsApp +263 77 260 6233.</dd></div>
      </dl>
      <div className="row"><Link className="btn" href="/contact#book">Book a yoga therapy session</Link></div>
      <p className="related">Related: <Link className="textlink" href="/ayurveda">Ayurveda consultations</Link> · <Link className="textlink" href="/treatments">Treatments</Link> · <Link className="textlink" href="/retreats">Retreats</Link></p>
    </div></section>
  </>);
}
