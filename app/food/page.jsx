import Link from "next/link";
import ReadMore from "@/components/ReadMore";
import PageHead from "@/components/PageHead";
export const metadata = { title: "Food as Nourishment", description: "Simple, seasonal Ayurvedic food and the From Our Kitchen recipe book." };
export default function Page() {
  return (<>
    <PageHead eyebrow="Food" title="Food as Nourishment" />
    <section><div className="wrap split">
     <ReadMore>
      <p>In Ayurveda, food is one of the most immediate and powerful ways to support balance. Sacred Falls celebrates simple, seasonal food that is fresh, colourful, deeply nourishing and full of flavour.</p>
      <p>All retreats and workshops serve food from the tri-dosha balanced recipes contained in our recipe book ‘From Our Kitchen’. Cooking demonstrations can be included in retreats and workshops.</p>
      <p>Our recipes are inspired by Ayurvedic principles while remaining accessible and enjoyable for modern life. From soothing soups and dhal to vibrant chutneys, wholesome breakfasts and nourishing treats, each recipe is designed to bring warmth, vitality and pleasure to the table.</p>
     </ReadMore>
     <img className="photo" src="/images/tea.jpg" alt="Tea being poured at a garden table" loading="lazy" />
    </div></section>
    <section className="alt"><div className="wrap narrow">
      <span className="eyebrow">Recipe book</span>
      <h2>From Our Kitchen</h2>
      <div className="bookrow">
        <img className="bookcover" src="/images/recipe-cover.jpg" alt="From Our Kitchen recipe book, front cover" loading="lazy" />
        <div>
          <p>Created with love, From Our Kitchen shares delicious, practical recipes to support everyday wellbeing. It is an invitation to make food a conscious and joyful part of your self care.</p>
          <p><strong>The recipe book is available to clients and to guests of retreats.</strong></p>
          <Link className="btn" href="/contact#book">Ask about the recipe book</Link>
        </div>
      </div>
    </div></section>
  </>);
}
