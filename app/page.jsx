import Link from "next/link";

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
      "Time and space to step away from daily life and return to what is essential. Ayurveda, yoga, nourishing food, meditation and nature, held worldwide.",
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
            <p className="script">Sacred Falls Ayurveda and Yoga</p>
            <h1>Return to your natural rhythm</h1>
            <p>Sacred Falls Ayurveda and Yoga offers a gentle, practical path towards greater balance, vitality and ease. Drawing on the ancient wisdom of Ayurveda and Yoga Therapy, Sara Norton supports each person to understand their unique constitution and create nourishing, sustainable practices for everyday life.</p>
            <p className="hide-m">Through personalised consultations, yoga therapy, retreats and wholesome food, you are invited to reconnect with the intelligence of your body, mind and spirit.</p>
            <p className="script big">Begin where you are. Restore what is needed. Live in greater harmony.</p>
            <div className="row">
              <Link className="btn" href="/contact#book">Book a consultation</Link>
              <Link className="textlink" href="#offerings">Explore our offerings</Link>
            </div>
          </div>
          <div className="collage">
            <img className="arch" src="/images/yoga-pose.jpg" alt="Triangle pose on a yoga mat in the garden" />
            <img className="print p1" src="/images/chavutti-ropes.jpg" alt="Sara practising Chavutti Uzhichil, holding the ropes" />
            <img className="print p2" src="/images/consult.jpg" alt="A consultation in conversation" />
          </div>
        </div>
      </section>

      <section className="meet">
        <div className="wrap meetgrid">
          <img className="portrait" src="/images/sara.jpg" alt="Sara Norton" />
          <div>
            <h2>Hello, I'm Sara Norton</h2>
            <p>I am a qualified Ayurveda Practitioner, Yoga Teacher and Yoga Therapist. My professional training took place in many different schools in Rishikesh and Kerala, India, where I immersed myself in the study and practice of these traditional systems of wellbeing.</p>
            <p>My work is practical and compassionate, with a deep respect for each person’s individual nature.</p>
            <Link className="textlink" href="/about">More about my work</Link>
          </div>
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
                {o.text.map((t) => <p key={t}>{t}</p>)}
                <Link className="textlink" href={o.href}>{o.cta}</Link>
              </div>
            </div>
          ))}
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
