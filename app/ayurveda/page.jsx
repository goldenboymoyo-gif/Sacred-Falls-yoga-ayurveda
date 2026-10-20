import Link from "next/link";
import PageHead from "@/components/PageHead";
export const metadata = { title: "Ayurveda Consultations", description: "Personal Ayurveda consultations with Sara Norton in Victoria Falls and online." };
export default function Page() {
  return (<>
    <PageHead eyebrow="Ayurveda" title="Personal Ayurveda Consultations" />
    <section><div className="wrap split">
     <div>
      <h2>Ayurveda for Modern Life</h2>
      <p>Ayurveda is an ancient system of holistic health that teaches us how to live in harmony with our individual nature and with the changing rhythms of the seasons.</p>
      <p>Rather than offering a one size fits all approach, Ayurveda considers the whole person: your constitution, digestion, energy, sleep, emotions, lifestyle and current circumstances. Small, thoughtful adjustments to food, routine and self care can make a meaningful difference to how you feel.</p>
      <p>At Sacred Falls, guidance is grounded, compassionate and designed to be realistically integrated into daily life.</p>
     </div>
     <img className="photo" src="/images/consult.jpg" alt="An Ayurveda consultation" loading="lazy" />
    </div></section>
    <section className="alt"><div className="wrap split rev">
     <div>
      <h2>Your consultation</h2>
      <p>An Ayurveda consultation is an opportunity to understand yourself more deeply and receive individual guidance for your present needs.</p>
      <p>We explore your natural constitution, current imbalances, digestion, sleep, energy, daily routine and relationship with food. You will receive practical recommendations that may include diet and food combining, daily rhythms, seasonal self care, yoga, breathing practices and herbs where appropriate.</p>
      <p>The intention is not perfection. It is to give you the understanding and tools to care for yourself with greater confidence and independence.</p>
      <p><strong>Consultations are available in person and online.</strong></p>
      <Link className="btn" href="/contact#book">Book an Ayurveda consultation</Link>
     </div>
     <img className="photo" src="/images/treatment.jpg" alt="Warm herbal oil used in an Ayurvedic treatment" loading="lazy" />
    </div></section>
  </>);
}
