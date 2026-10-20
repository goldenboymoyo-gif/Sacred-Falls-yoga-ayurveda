import PageHead from "@/components/PageHead";
import BookingForm from "@/components/BookingForm";
import ContactDetails from "@/components/ContactDetails";
export const metadata = { title: "Contact & Booking", description: "Book a consultation or get in touch with Sacred Falls Ayurveda and Yoga in Victoria Falls, Zimbabwe." };
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
      </div>
    </div></section>
  </>);
}
