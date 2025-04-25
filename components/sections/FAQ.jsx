import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How long does installation typically take?",
    answer:
      "Installation time varies depending on the size and complexity of the system. A basic residential system can be installed in 4-6 hours, while larger commercial systems may take 1-2 days. We'll provide you with a specific timeframe during your consultation.",
  },
  {
    question: "Do you offer warranties on your products and installation?",
    answer:
      "Yes, all our products come with manufacturer warranties ranging from 1-5 years. Additionally, we provide a 1-year warranty on our installation services. Extended warranty options are also available for purchase.",
  },
  {
    question: "Can I access my cameras remotely?",
    answer:
      "All our systems are configured for remote access through mobile apps and web browsers. You can view live footage, playback recordings, and receive notifications from anywhere with an internet connection.",
  },
  {
    question: "What types of properties do you service?",
    answer:
      "We install security camera systems for residential homes, small businesses, retail stores, warehouses, office buildings, and industrial facilities. Our team has experience with properties of all sizes and security requirements.",
  },
  {
    question: "Do you offer maintenance plans?",
    answer:
      "Yes, we offer several maintenance plans that include regular system checks, software updates, cleaning, and priority support. These plans help ensure your security system remains in optimal condition and extends its lifespan.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Frequently Asked Questions
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to common questions about our security camera installation services.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl py-12">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
