import { CheckCircle } from "lucide-react"
import { services } from "@/lib/constants"



export default function Services() {
  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/90 to-primary/50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Features & Services</h2>
            <p className="max-w-[900px] text-muted md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We provide comprehensive security solutions tailored to your specific needs.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 py-12 lg:grid-cols-2">
          {services.map((service, index) => (
            <div key={index} className="flex items-start space-x-4">
              <CheckCircle className="self-start size-8 text-muted" />
              <div>
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="text-muted">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}