import PageHead from "@/components/PageHead";
import BookingForm from "@/components/BookingForm";
import ContactDetails from "@/components/ContactDetails";
export const metadata = { title: "Book a Consultation or Contact Sacred Falls", description: "Book an Ayurveda consultation, yoga therapy session or treatment, or enquire about retreats with Sacred Falls Ayurveda and Yoga in Victoria Falls, Zimbabwe, by form, call or WhatsApp." };
export default function Page() {
  return (<>
    <PageHead eyebrow="Contact" title="Book or get in touch">Consultations available in person and online.</PageHead>
    <section id="book"><div className="wrap" style={{ display: "grid", gap: 48, gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))" }}>
      <div>
        <h2>Booking request</h2>
        <p>Share a few details and Sara will get back to you to confirm a time.</p>
        <BookingForm />
      </div>
      <div>
        <h2>Contact</h2>
        <ContactDetails />
        <p className="muted">Sessions are by appointment at <a className="textlink" href="https://www.thearthousevictoriafalls.com/" target="_blank" rel="noopener noreferrer">The Art House</a>, 360 Gibson Road, Victoria Falls. <a className="btn ghost" href="https://www.thearthousevictoriafalls.com/" target="_blank" rel="noopener noreferrer">Visit The Art House website</a></p>
      </div>
    </div></section>
  </>);
}
