import Link from "next/link"
import { Check, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { pricingPlans, additionalServices } from "@/lib/constants"



export default function Pricing() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/90 to-primary/50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Security Packages</h2>
            <p className="max-w-[900px] text-muted md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the right security solution for your property and budget
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          {pricingPlans.map((plan) => (
            <div key={plan.id} className="relative flex flex-col overflow-hidden rounded-lg border bg-background shadow-lg transition-all hover:shadow-xl">
              {plan.isPopular && (
                <div className="absolute right-4 top-4">
                  <Badge className="bg-primary px-3 py-1 text-primary-foreground">Popular</Badge>
                </div>
              )}
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="grid gap-4 p-6 pt-0">
                {!plan.isCustom ? <Badge> <span className="text-xs">starting from</span></Badge> :  <Badge> <span className="text-xs">contact us</span></Badge>}
             
                <div className="flex items-baseline justify-center gap-1">
                  
                  {!plan.isCustom && <span className="text-3xl font-bold">$</span>}
                  <span className='text-5xl font-bold'>
                    {plan.price}
                  </span>
                </div>
                <ul className="grid gap-2.5">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={feature.included ? '' : 'text-muted-foreground'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto p-6 pt-0">
                <Button asChild variant={plan.buttonVariant} className="w-full">
                  <Link href="#contact">
                    {plan.buttonText || 'Get Started'}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div className="mx-auto max-w-6xl rounded-lg border bg-background p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6">Additional Services & Add-ons</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {additionalServices.map((service) => (
              <div key={service.id} className="flex items-center gap-4 rounded-lg border p-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">{service.name}</h4>
                  <p className="text-sm text-muted-foreground">{service.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-3xl text-center mt-12">
          <p className="text-muted mb-6">
            All packages include professional installation, system configuration, and basic training. Contact us for a
            custom quote tailored to your specific security needs.
          </p>
          <Button asChild size="lg">
            <Link href="#contact">Request Custom Quote</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}