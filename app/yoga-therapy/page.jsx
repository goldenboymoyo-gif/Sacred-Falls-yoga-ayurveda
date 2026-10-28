import Link from "next/link";
import ReadMore from "@/components/ReadMore";
import PageHead from "@/components/PageHead";
import Fig from "@/components/Fig";
export const metadata = { title: "Yoga Therapy", description: "Private yoga therapy sessions adapted to your needs, with Sara Norton." };
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
  </>);
}
