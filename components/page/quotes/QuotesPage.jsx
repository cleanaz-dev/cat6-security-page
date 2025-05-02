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
import { Mail } from "lucide-react";

export default function QuotesPage() {
  const { quotes = [] } = useQuote();

  return (
    <div className="container mx-auto py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Quotes</h1>
        <Link href="/quotes/create-quote">
          <Button  size="sm" className="cursor-pointer">
           
            Create a New Quote
          </Button>
        </Link>
      </header>

      {quotes.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No quotes available</h3>
          <p className="text-muted-foreground mt-2">
            Create your first quote to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {quotes.map((quote, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border border-muted p-4 rounded-lg">
              {/* Card Header - Show Top-Level Info */}
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-semibold">Quote #{index + 1}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {quote.client.name || "No client specified"}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="capitalize">
                    {quote.paymentUrl ? "Active" : "Draft"}
                  </Badge>
                  <span className="text-lg font-semibold">${quote.total?.toFixed(2) || "0.00"}</span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/quotes/${quote.id}`} >
                      View
                      </Link>
                    
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
              </CardHeader>

              {/* Accordion for more details */}
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value={`quote-${index}`}>
                    <AccordionTrigger>View More Details</AccordionTrigger>
                    <AccordionContent>
                      {/* Items List */}
                      {quote.items?.length > 0 && (
                        <div className="mt-4">
                          <h3 className="font-semibold">Items</h3>
                          <ul className="space-y-2">
                            {quote.items.map((item, idx) => (
                              <li key={idx} className="flex justify-between">
                                <span>{item.name}</span>
                                <span className="flex items-center">
                                  ${item.price} | Qty: {item.quantity}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Date Created */}
                      <div className="mt-4 flex justify-between">
                        <span className="text-sm text-muted-foreground">Created</span>
                        <span className="text-sm">
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
