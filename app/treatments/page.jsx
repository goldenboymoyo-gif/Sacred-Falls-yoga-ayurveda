import Link from "next/link";
import ReadMore from "@/components/ReadMore";
import PageHead from "@/components/PageHead";
import Fig from "@/components/Fig";
export const metadata = { title: "Chavutti Uzhichil and Ayurvedic Treatments in Victoria Falls", description: "Traditional Kerala Chavutti Uzhichil bodywork and warm herbal oil Ayurvedic treatments with Sara Norton in Victoria Falls, Zimbabwe. What happens, training and how to book." };
export default function Page() {
  return (<>
    <PageHead eyebrow="Hands-on therapies" title="Treatments & Chavutti Uzhichil" />
    <section><div className="wrap narrow">
      <h2>Ayurvedic Treatments</h2>
      <div className="chgrid two">
        <Fig src="/images/dough-oil.jpg" cap="Warm herbal oil held in a ring of dough on the back" />
        <Fig src="/images/dough-oil2.jpg" cap="Herbal oil being poured into the dough ring" />
      </div>
      <ReadMore>
        <p>Ayurvedic treatments use warm herbal oils applied with care, including oil held on the body within a ring of dough, to soothe, nourish and restore balance.</p>
        <Link className="btn" href="/contact#book">Book a treatment</Link>
      </ReadMore>
    </div></section>
    <section className="alt" id="chavutti"><div className="wrap narrow">
      <span className="eyebrow">Traditional Kerala bodywork</span>
      <h2>Chavutti Uzhichil</h2>
      <div className="chgrid two">
        <Fig src="/images/chav3.jpg" alt="Sara holding the ropes during Chavutti Uzhichil" cap="Sara using the overhead ropes for balance" />
        <Fig src="/images/chav2.jpg" alt="Sara giving a Chavutti Uzhichil treatment" cap="A floor-based Chavutti Uzhichil treatment outdoors" />
      </div>
      <ReadMore>
        <p>Chavutti Uzhichil is a traditional Kerala bodywork practice rooted in Kalarippayattu, India’s ancient martial arts tradition. It was traditionally used within Kalari training to prepare and restore the body for demanding practice, helping practitioners maintain suppleness, strength and readiness for movement.</p>
        <p>During a floor-based treatment, the client usually lies face down while the practitioner uses warm oil and carefully controlled foot pressure in long, flowing strokes. A suspended rope supports the practitioner’s balance and enables the work to be delivered with steadiness and precision.</p>
        <p>Sara trained in this traditional Kalarippayattu bodywork practice at CVN Kalari Nadakav in Calicut, India. Her treatment honours its martial-arts lineage while being adapted thoughtfully to the individual.</p>
        <Link className="btn" href="/contact#book">Book a treatment</Link>
      </ReadMore>
    </div></section>
    <section id="practical"><div className="wrap narrow">
      <h2>Practical details and booking</h2>
      <dl className="facts">
        <div><dt>Where</dt><dd><a className="textlink" href="https://www.thearthousevictoriafalls.com/" target="_blank" rel="noopener noreferrer">The Art House</a>, 360 Gibson Road, Victoria Falls, by appointment.</dd></div>
        <div><dt>Before you book</dt><dd>Please tell Sara about any injuries, pregnancy or medical conditions so the treatment can be adapted safely. Treatments support wellbeing and do not replace medical care.</dd></div>
        <div><dt>How to book</dt><dd>Use the <Link className="textlink" href="/contact#book">booking form</Link>, or call or WhatsApp +263 77 260 6233.</dd></div>
      </dl>
      <div className="row"><Link className="btn" href="/contact#book">Book a treatment</Link></div>
      <p className="related">Related: <Link className="textlink" href="/ayurveda">Ayurveda consultations</Link> · <Link className="textlink" href="/yoga-therapy">Yoga Therapy</Link> · <Link className="textlink" href="/retreats">Retreats</Link></p>
    </div></section>
  </>);
}
