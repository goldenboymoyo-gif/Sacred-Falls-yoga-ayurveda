import Link from "next/link";
import ReadMore from "@/components/ReadMore";
import PageHead from "@/components/PageHead";
export const metadata = { title: "Ayurveda Consultations", description: "Personal Ayurveda consultations with Sara Norton in Victoria Falls and online." };
export default function Page() {
  return (<>
    <PageHead eyebrow="Ayurveda" title="Personal Ayurveda Consultations" />
    <section><div className="wrap split">
     <ReadMore>
      <h2>Ayurveda for Modern Life</h2>
      <p>Ayurveda is an ancient system of holistic health that teaches us how to live in harmony with our individual nature and with the changing rhythms of the seasons.</p>
      <p>Rather than offering a one size fits all approach, Ayurveda considers the whole person: your constitution, digestion, energy, sleep, emotions, lifestyle and current circumstances. Small, thoughtful adjustments to food, routine and self care can make a meaningful difference to how you feel.</p>
      <p>At Sacred Falls, guidance is grounded, compassionate and designed to be realistically integrated into daily life.</p>
     </ReadMore>
     <img className="photo" src="/images/consult.jpg" alt="An Ayurveda consultation" loading="lazy" />
    </div></section>
    <section className="alt"><div className="wrap split rev">
     <ReadMore>
      <h2>Your consultation</h2>
      <p>An Ayurveda consultation is an opportunity to understand yourself more deeply and receive individual guidance for your present needs.</p>
      <p>We explore your natural constitution, current imbalances, digestion, sleep, energy, daily routine and relationship with food. You will receive practical recommendations that may include diet and food combining, daily rhythms, seasonal self care, yoga, breathing practices and herbs where appropriate.</p>
      <p>The intention is not perfection. It is to give you the understanding and tools to care for yourself with greater confidence and independence.</p>
      <p><strong>Consultations are available in person and online.</strong></p>
      <Link className="btn" href="/contact#book">Book an Ayurveda consultation</Link>
     </ReadMore>
     <img className="photo" src="/images/treatment.jpg" alt="Warm herbal oil used in an Ayurvedic treatment" loading="lazy" />
    </div></section>
    <section id="chavutti"><div className="wrap narrow">
      <span className="eyebrow">Traditional Kerala bodywork</span>
      <h2>Chavutti Uzhichil</h2>
      <div className="chgrid">
        <img className="photo" src="/images/chavutti-ropes.jpg" alt="Sara holding the ropes during Chavutti Uzhichil" loading="lazy" />
        <img className="photo" src="/images/chavutti-top.jpg" alt="Chavutti Uzhichil seen from above" loading="lazy" />
        <img className="photo" src="/images/chavutti-foot.jpg" alt="Foot pressure with warm oil" loading="lazy" />
      </div>
      <ReadMore>
        <p>Chavutti Uzhichil is a traditional Kerala bodywork practice rooted in Kalarippayattu, India’s ancient martial arts tradition. It was traditionally used within Kalari training to prepare and restore the body for demanding practice, helping practitioners maintain suppleness, strength and readiness for movement.</p>
        <p>During a floor-based treatment, the client usually lies face down while the practitioner uses warm oil and carefully controlled foot pressure in long, flowing strokes. A suspended rope supports the practitioner’s balance and enables the work to be delivered with steadiness and precision.</p>
        <p>Sara trained in this traditional Kalarippayattu bodywork practice at CVN Kalari Nadakav in Calicut, India. Her treatment honours its martial-arts lineage while being adapted thoughtfully to the individual.</p>
        <Link className="btn" href="/contact#book">Book a treatment</Link>
      </ReadMore>
    </div></section>
  </>);
}
