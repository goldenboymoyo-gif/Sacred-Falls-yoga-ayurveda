import Link from "next/link";
import Events from "@/components/Events";
import Certificates from "@/components/Certificates";

const offerings = [
  {
    title: "Ayurveda Consultations",
    img: "/images/consult.jpg",
    alt: "A one-to-one Ayurveda consultation",
    href: "/ayurveda",
    text: [
      "Ayurveda is an ancient system of holistic health that teaches us how to live in harmony with our individual nature and with the changing rhythms of the seasons.",
      "Rather than offering a one size fits all approach, it considers the whole person: your constitution, digestion, energy, sleep, emotions and lifestyle.",
    ],
    cta: "About consultations",
  },
  {
    title: "Yoga Therapy",
    img: "/images/yoga-incense.jpg",
    alt: "Guided meditation outdoors",
    href: "/yoga-therapy",
    text: [
      "Sessions are adapted to your needs, experience and capacity, using movement, breath, relaxation, meditation and simple lifestyle practices.",
      "Private sessions offer a quiet, supportive space to move at your own pace and develop a practice that is truly your own.",
    ],
    cta: "About yoga therapy",
  },
  {
    title: "Food as Nourishment",
    img: "/images/tea.jpg",
    alt: "Tea being poured at a garden table",
    href: "/food",
    text: [
      "Simple, seasonal food that is fresh, colourful, deeply nourishing and full of flavour. Soothing soups and dhal, vibrant chutneys, wholesome breakfasts and nourishing treats.",
      "Find them all in our recipe book, From Our Kitchen.",
    ],
    cta: "Recipes and the book",
  },
  {
    title: "Retreats, Workshops and Shared Learning",
    img: "/images/circle.jpg",
    alt: "A small group gathered on the lawn",
    href: "/retreats",
    text: [
      "Time and space to step away from daily life and return to what is essential. Ayurveda, yoga, yoga therapy, nourishing food, meditation and nature, held within Zimbabwe and worldwide.",
      "Selected retreats can be combined with safari experiences in the wilderness of Africa.",
    ],
    cta: "See what's coming up",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero2">
        <div className="wrap hero2grid">
          <div className="herotext">
            <p className="script brand">Sacred Falls Ayurveda and Yoga</p>
            <h1 className="tagline">Return to your natural rhythm</h1>
            <p>Sacred Falls Ayurveda and Yoga offers a gentle, practical path towards greater balance, vitality and ease. Drawing on the ancient wisdom of Ayurveda and Yoga Therapy, Sara Norton supports each person to understand their unique constitution and create nourishing, sustainable practices for everyday life.</p>
            <p className="hide-m">Through personalised consultations, yoga therapy, workshops, retreats and wholesome food, you are invited to reconnect with the intelligence of your body, mind and spirit.</p>
            <p className="script big">Begin where you are. Restore what is needed. Live in greater harmony.</p>
            <div className="row">
              <Link className="btn" href="/contact#book">Book a consultation</Link>
              <Link className="textlink" href="#offerings">Explore our offerings</Link>
            </div>
          </div>
          <div className="collage">
            <img className="arch" src="/images/yoga-pose.jpg" alt="Triangle pose on a yoga mat in the garden" />
            <img className="print p1" src="/images/chav3.jpg" alt="Sara practising Chavutti Uzhichil, holding the ropes" />
            <img className="print p2" src="/images/consult.jpg" alt="A consultation in conversation" />
          </div>
        </div>
      </section>

      <section className="meet" id="about-sara">
        <div className="wrap meetgrid">
          <img className="portrait" src="/images/sara.jpg" alt="Sara Norton smiling, wearing a teal sari blouse and jasmine flowers in her hair" />
          <div>
            <h2>Hello, I'm Sara Norton</h2>
            <p>I am a qualified Ayurveda Practitioner, Yoga Teacher and Yoga Therapist. My professional training took place in many different schools in Rishikesh and Kerala, India, where I immersed myself in the study and practice of these traditional systems of wellbeing.</p>
            <p>My work brings together the wisdom of Ayurveda, the therapeutic application of yoga, and a deep respect for each person’s individual nature. I offer practical, compassionate guidance to help you understand your constitution, support balance in daily life and develop sustainable practices for long term wellbeing.</p>
            <p>Through personalised consultations, yoga therapy, food tables and dietary guidance, seasonal self care and mindful daily routines, I support people to reconnect with their bodies, settle their minds and live with greater vitality and ease.</p>
            <p className="muted">Find us at <a className="textlink" href="https://www.thearthousevictoriafalls.com/" target="_blank" rel="noopener noreferrer">The Art House</a>, 360 Gibson Road, Victoria Falls.</p>
          </div>
        </div>
        <div className="wrap narrow" style={{ marginTop: 36 }}>
          <h3>Training and Qualifications</h3>
          <ul className="list">
            <li>Qualified Ayurveda Practitioner</li><li>Qualified Yoga Teacher</li><li>Qualified Yoga Therapist</li><li>Training in many different schools in Rishikesh and Kerala, India</li>
          </ul>
          <Certificates />
        </div>
        <div className="wrap narrow faq" style={{ marginTop: 36 }}>
          <h3>Frequently Asked Questions</h3>
          <details><summary>What is Ayurveda?</summary><p>Ayurveda is an ancient system of holistic health that teaches us how to live in harmony with our individual nature and with the changing rhythms of the seasons.</p></details>
          <details><summary>What happens in a consultation?</summary><p>We explore your natural constitution, current imbalances, digestion, sleep, energy, daily routine and relationship with food. You receive practical recommendations that may include diet, daily rhythms, seasonal self care, yoga, breathing practices and herbs where appropriate.</p></details>
          <details><summary>Are consultations available online?</summary><p>Yes. Consultations are available in person and online.</p></details>
          <details><summary>Do I need yoga experience for yoga therapy?</summary><p>No. Sessions are adapted to your needs, experience and capacity, using poses, breath, relaxation, meditation and mudras.</p></details>
          <details><summary>What is Chavutti Uzhichil?</summary><p>A traditional Kerala bodywork practice rooted in Kalarippayattu, using warm oil and controlled foot pressure, supported by a suspended rope. <Link className="textlink" href="/treatments">Read more</Link>.</p></details>
          <details><summary>Where are you based and how do I book?</summary><p>Sessions are by appointment at The Art House, 360 Gibson Road, Victoria Falls. Use the booking form, or call or WhatsApp +263 77 260 6233.</p></details>
          <details><summary>Is food provided on retreats?</summary><p>Yes. Retreats and workshops serve food from the tri-dosha balanced recipes in our recipe book, From Our Kitchen, which is available to clients and to guests of retreats.</p></details>
        </div>
      </section>

      <section id="offerings" className="offer">
        <div className="wrap">
          <h2 className="center">How we can work together</h2>
          {offerings.map((o, i) => (
            <div className={"orow" + (i % 2 ? " flip" : "")} key={o.title}>
              <img className={"oimg v" + i} src={o.img} alt={o.alt} loading="lazy" />
              <div>
                <h3>{o.title}</h3>
                {o.text.map((t, k) => <p key={t} className={i === 0 && k === 0 ? "smallp" : undefined}>{t}</p>)}
                <Link className="textlink" href={o.href}>{o.cta}</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="alt upcoming" id="upcoming">
        <div className="wrap narrow">
          <h2 className="center">Upcoming Retreats and Events</h2>
          <Events />
          <div className="row" style={{ justifyContent: "center", marginTop: "1.2rem" }}>
            <Link className="btn" href="/retreats">All retreats and workshops</Link>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="wrap narrow center">
          <h2>A Gentler Way Forward</h2>
          <p>You do not need to overhaul your life to begin feeling more balanced. Often, the most profound changes start with a few well chosen daily practices: eating in a way that suits you, resting more deeply, moving with awareness and creating space to listen to yourself.</p>
          <p>Sacred Falls Ayurveda and Yoga is here to support that journey.</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link className="btn" href="/contact#book">Book your consultation</Link>
            <Link className="btn ghost" href="/contact">Get in touch</Link>
          </div>
        </div>
      </section>
    </>
  );
}
