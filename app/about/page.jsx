import Link from "next/link";
import PageHead from "@/components/PageHead";
export const metadata = { title: "About Sara Norton", description: "Sara Norton is a qualified Ayurveda Practitioner, Yoga Teacher and Yoga Therapist trained in Rishikesh and Kerala." };
export default function Page() {
  return (<>
    <PageHead eyebrow="About" title="About Sara Norton" />
    <section><div className="wrap split">
     <div>
      <p>Sara Norton is a qualified Ayurveda Practitioner, Yoga Teacher and Yoga Therapist. Her professional training took place in India, including in Rishikesh and Kerala, where she immersed herself in the study and practice of these traditional systems of wellbeing.</p>
      <p>Her work brings together the wisdom of Ayurveda, the therapeutic application of yoga, and a deep respect for each person’s individual nature. Sara offers practical, compassionate guidance to help clients understand their constitution, support balance in daily life and develop sustainable practices for long term wellbeing.</p>
      <p>Through personalised consultations, yoga therapy, food, seasonal self care and mindful daily routines, she supports people to reconnect with their bodies, settle their minds and live with greater vitality and ease.</p>
     </div>
     <img className="photo portraitbig" src="/images/sara.jpg" alt="Sara Norton" />
    </div></section>
    <section className="alt"><div className="wrap narrow">
      <h2>Training and Qualifications</h2>
      <ul className="list">
        <li>Qualified Ayurveda Practitioner</li><li>Qualified Yoga Teacher</li><li>Qualified Yoga Therapist</li><li>Training undertaken in Rishikesh and Kerala, India</li>
      </ul>
      <p style={{ marginTop: "1.2rem" }}>Images of Sara’s professional certificates:</p>
      {/* Add certificate images to /public/certs and replace these placeholders with <img> tags */}
      <div className="certs"><div className="cert">Certificate 1</div><div className="cert">Certificate 2</div><div className="cert">Certificate 3</div></div>
    </div></section>
    <section><div className="wrap narrow" style={{ textAlign: "center" }}>
      <Link className="btn" href="/contact#book">Book a consultation</Link>
    </div></section>
  </>);
}
