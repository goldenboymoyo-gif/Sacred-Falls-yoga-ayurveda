import Link from "next/link";
import ReadMore from "@/components/ReadMore";
import PageHead from "@/components/PageHead";
import Fig from "@/components/Fig";
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
    <section className="alt" id="food"><div className="wrap narrow">
      <span className="eyebrow">The heart of Ayurveda</span>
      <h2>Food and Nutrition</h2>
      <div className="chgrid">
        <Fig src="/images/food-1.jpg" cap="Spinach dhal served by candlelight" />
        <Fig src="/images/tea.jpg" cap="Tea being poured at a garden table" />
        <Fig src="/images/food-2.jpg" cap="Rice, raita and dhal, home-cooked" />
      </div>
      <ReadMore>
        <p>In Ayurveda, food is the main healing. What we eat, how we prepare it and when we eat it shape our digestion, energy, sleep and mood every day.</p>
        <p>Sara teaches simple, seasonal cooking that suits your own constitution: soothing soups and dhal, fresh chutneys, wholesome breakfasts and nourishing teas, all gathered in her recipe book, From Our Kitchen.</p>
      </ReadMore>
      <div className="chgrid">
        <Fig src="/images/food-3.jpg" cap="A table set with dishes made for our guests" />
        <Fig src="/images/garden-tea.jpg" cap="Tea served in the garden" />
        <Fig src="/images/food-4.jpg" cap="Green dhal and raita by candlelight" />
      </div>
      <Link className="btn" href="/food">Recipes and the book</Link>
    </div></section>
    <section><div className="wrap narrow center">
      <h2>Treatments and Chavutti Uzhichil</h2>
      <p>Warm herbal oil treatments and traditional Kerala bodywork with Sara.</p>
      <Link className="btn" href="/treatments">See treatments</Link>
    </div></section>
  </>);
}
