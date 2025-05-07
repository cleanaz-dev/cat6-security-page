import ContactProvider from "@/lib/context/ContactProvider";
import { getAllContacts } from "@/lib/hubspot";

export default async function ContactLayout({ children }) {
  const contacts = await getAllContacts();
  // console.log("contacts:", contacts);
  return (
    <div>
      <ContactProvider data={{ contacts }}>{children}</ContactProvider>
    </div>
  );
}
