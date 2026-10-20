import Link from "next/link";
import PageHead from "@/components/PageHead";
export const metadata = { title: "Yoga Therapy", description: "Private yoga therapy sessions adapted to your needs, with Sara Norton." };
export default function Page() {
  return (<>
    <PageHead eyebrow="Yoga" title="Yoga Therapy" />
    <section><div className="wrap split">
     <div>
      <p>Yoga Therapy uses the wisdom and practices of yoga to support individual wellbeing. Sessions are adapted to your needs, experience and capacity, using movement, breath, relaxation, meditation and simple lifestyle practices.</p>
      <p>Whether you are seeking more strength and flexibility, greater calm, support through a demanding period, or a more intimate relationship with your body, yoga can become a deeply personal tool for renewal.</p>
      <p>Private sessions offer a quiet, supportive space to move at your own pace and develop a practice that is truly your own.</p>
      <Link className="btn" href="/contact#book">Book a yoga therapy session</Link>
     </div>
     <div className="pair"><img className="photo" src="/images/yoga-pose.jpg" alt="Triangle pose on a mat in the garden" loading="lazy" /><img className="photo" src="/images/yoga-incense.jpg" alt="Guided meditation outdoors" loading="lazy" style={{ marginTop: 40 }} /></div>
    </div></section>
  </>);
}
