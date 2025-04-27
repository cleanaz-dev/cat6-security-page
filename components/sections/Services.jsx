
import { services } from "@/lib/constants";
import Image from "next/image";

export default function Services() {
  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/95 to-primary/60">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-white drop-shadow-md">
            Features & Services
          </h2>
          <p className="max-w-[900px] text-secondary/90 md:text-xl lg:text-lg xl:text-xl">
            Comprehensive security solutions tailored to your specific needs.
          </p>
        </div>
        <div className="space-y-12">
          {services.map((service, index) => (
            <div 
            key={index}
            className={`flex flex-col md:flex-row ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } items-start gap-6 md:gap-12 bg-gradient-to-br from-transparent to-secondary/05 backdrop-blur-sm rounded-xl p-6`}
          >
            <div className="w-full md:w-1/2">
              <Image
                src={service.imgUrl}
                width={500}
                height={300}
                alt={service.title}
                className="object-cover rounded-lg w-full h-[300px] md:h-[350px]"
                priority={index < 2}
              />
            </div>
            <div className="w-full md:w-1/2 flex items-start">
              <div className="text-left">
                <h3 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-2">
                  {service.title}
                </h3>
                <p className="text-secondary/90 text-base md:text-xl lg:text-3xl leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
    </section>
  );
}