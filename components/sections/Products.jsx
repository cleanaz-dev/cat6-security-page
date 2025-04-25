
import { Card, CardContent } from "@/components/ui/card"
import { products } from "@/lib/constants"



export default function Products() {
  return (
    <section id="products" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Premium Security Products</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We offer a wide range of high-quality security camera systems for residential and commercial properties.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <Card key={product.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="mb-4 rounded-full bg-primary/10 p-4">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{product.title}</h3>
                    <p className="text-center text-muted-foreground">
                      {product.description}
                    </p>
                    {/* <Button variant="outline" className="w-full cursor-pointer">
                      Learn More
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}