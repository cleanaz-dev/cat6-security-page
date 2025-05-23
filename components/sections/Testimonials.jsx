import Image from "next/image";
import { CheckCircle } from "lucide-react";
import testimonialsImg3 from "@/public/images/testimonials-3.png";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const testimonials = [
  {
    id: 1,
    quote:
      "Cat6 Security transformed our retail store's security system. The cameras are discreet yet effective, and the mobile access allows me to monitor my business from anywhere. Their team was professional and completed the installation ahead of schedule.",
    name: "Anthony Johnson",
    role: "Owner, Johnson's Electronics",
    stars: 5,
    imgUrl: "https://res.cloudinary.com/dmllgn0t7/image/upload/v1747802594/michael-johnson--headshot_dxkveb.png"
  },
  {
    id: 2,
    quote:
      "After a break-in at our warehouse, we hired Cat6 Security to install a comprehensive security system. Their expertise in camera placement and system integration was impressive. We've had zero incidents since installation.",
    name: "Sarah Williams",
    role: "Operations Manager, Williams Distribution",
    stars: 5,
    imgUrl: "https://res.cloudinary.com/dmllgn0t7/image/upload/v1747802593/sarah-williams--headshot-_fooqvd.png"
  },
  {
    id: 3,
    quote:
      "We needed a security solution for our new office building that would integrate with our access control system. Cat6 Security delivered a seamless solution that exceeded our expectations. Their ongoing support has been exceptional.",
    name: "David Chen",
    role: "IT Director, Chen Enterprises",
    stars: 5,
    imgUrl: "https://res.cloudinary.com/dmllgn0t7/image/upload/v1747802593/david-chen--headshot-_gi930r.png"
  },
];

const caseStudyItems = [
  "4K resolution for clear visibility",
  "Facial recognition to monitor repeat offenders",
  "POS integration for cash register cameras",
  "Discreet cameras blending with boutique decor",
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="w-full py-12 md:py-24 lg:py-32 bg-background"
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Customer Success Stories
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Don't just take our word for it. See what our clients have to say
              about our security solutions.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`flex flex-col justify-between rounded-lg border  p-6 shadow-lg`}
            >
              <div className="space-y-4">
                <div className="flex">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-yellow-500"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-based italic">
                  "{testimonial.quote}"
                </blockquote>
              </div>
              <div className="mt-6 flex items-center space-x-4">
                <div className="rounded-full bg-slate-100">
                  <Avatar>
                    <AvatarImage
                      src={testimonial.imgUrl}
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="font-semibold text-primary decoration-2 decoration-primary-muted underline">
                    {testimonial.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Case Study */}
        <div className="mx-auto max-w-6xl rounded-lg border bg-background p-8 shadow-lg">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Success Story
              </div>
              <h3 className="text-2xl font-bold">
                Downtown Boutique Security Upgrade
              </h3>
              <p className="text-muted-foreground">
                A trendy downtown clothing boutique needed to curb shoplifting
                while preserving its upscale ambiance. Our tailored security
                solution integrated discreet surveillance with advanced inventory
                protection.
              </p>
              <ul className="space-y-2">
                {caseStudyItems.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://res.cloudinary.com/dmllgn0t7/image/upload/e_art:quartz/v1745612714/testimonials-3_axzgiy.png"
                width={500}
                height={400}
                alt="Downtown Boutique security installation showing discreet camera integration"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}