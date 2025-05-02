"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useQuote } from "@/lib/context/QuoteProvider";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function QuotesPage() {
  const { quotes = [] } = useQuote();

  return (
    <div className="container px-2 md:px-0 mx-auto py-4 md:py-8">
      <header className="flex justify-between items-center mb-4 md:mb-8">
        <h1 className="text-lg md:text-3xl font-bold">All Quotes</h1>
        <Link href="/quotes/create-quote">
          <Button size="sm" className="text-xs md:text-sm">
            Create New
          </Button>
        </Link>
      </header>

      {quotes.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <h3 className="text-base md:text-lg font-medium">
            No quotes available
          </h3>
          <p className="text-muted-foreground text-sm md:text-base mt-1 md:mt-2">
            Create your first quote to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:gap-6">
          {quotes.map((quote, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow border border-muted p-2 md:p-4 rounded-lg"
            >
              {/* Mobile-first layout */}
              <CardHeader className="p-2 md:p-6">
                <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between md:items-center">
                  <div>
                    <CardTitle className="text-sm md:text-lg font-semibold">
                      Quote #{index + 1}
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm text-muted-foreground">
                      {quote.client?.name || "No client specified"}
                    </CardDescription>
                  </div>

                  {/* Mobile: Stacked layout */}
                  <div className="md:hidden space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="capitalize text-xs">
                        {quote.paymentUrl ? "Active" : "Draft"}
                      </Badge>
                      <span className="text-sm font-medium">
                        ${quote.total?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-xs"
                      >
                        <Link href={`/quotes/${quote.id}`}>View</Link>
                      </Button>
                      {quote.paymentUrl && (
                        <Button size="xs" asChild className="text-xs">
                          <Link href={quote.paymentUrl} target="_blank">
                            Pay
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Desktop: Horizontal layout */}
                  <div className="hidden md:flex items-center space-x-4">
                    <Badge variant="secondary" className="capitalize">
                      {quote.paymentUrl ? "Active" : "Draft"}
                    </Badge>
                    <span className="text-lg font-semibold">
                      ${quote.total?.toFixed(2) || "0.00"}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/quotes/${quote.id}`}>View</Link>
                      </Button>
                      {quote.paymentUrl && (
                        <Button size="sm" asChild>
                          <Link href={quote.paymentUrl} target="_blank">
                            Pay
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Accordion - same for both mobile and desktop */}
              <CardContent className="-mt-6 md:mt-0 px-2 md:px-6 pb-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value={`quote-${index}`}>
                    <AccordionTrigger className="text-sm md:text-base">
                      View Details
                    </AccordionTrigger>
                    <AccordionContent>
                      {quote.items?.length > 0 && (
                        <div className="mt-2">
                          <h3 className="font-medium text-sm md:text-base">
                            Items
                          </h3>
                          <ul className="mt-1 space-y-2 md:space-y-1">
                            {quote.items.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex justify-between text-xs md:text-sm"
                              >
                                <span>{item.name}</span>
                                <span>
                                  ${item.price} × {item.quantity}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="mt-2 flex justify-between text-xs md:text-sm">
                        <span className="text-muted-foreground">Created</span>
                        <span>
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
