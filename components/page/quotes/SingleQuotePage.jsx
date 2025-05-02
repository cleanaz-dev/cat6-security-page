"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Activity,
  Mail,
  Hash,
  CircleUserRound,
  ShoppingBasket,
  Wallet,
  User,
  Trash2,
  StickyNote,
  Send,
  Pencil,
  Logs 
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuote } from "@/lib/context/QuoteProvider";


export default function SingleQuotePage({ quote }) {
  const { logs = [], handleSend, loading } = useQuote();
  return (
    <div className="container px-1.5 md:mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Quote #{quote.id.slice(0, 8)}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={quote.status === "pending" ? "secondary" : "default"}>
            {quote.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Created: {new Date(quote.createdAt).toLocaleDateString()}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Info */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex gap-2 items-center">
                <CircleUserRound />
                Client Information
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <User size={20} />
                <p className="font-medium"> {quote.client.name}</p>
              </div>

              <div className="flex gap-2 items-center">
                <Mail size={20} />{" "}
                <p className="text-sm  text-muted-foreground">
                  {quote.client.email}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Hash size={20} />
                <p className="text-sm text-muted-foreground">
                  HubSpot ID: {quote.client.hs_object_id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex gap-2 items-center">
                <Wallet size={20} /> Payment Details
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${quote.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${quote.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          {/* <CardFooter>
            <Button asChild className="w-full">
              <Link href={quote.paymentUrl} target="_blank">
                Pay Now
              </Link>
            </Button>
          </CardFooter> */}
        </Card>
        {/* Action Card */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>
              <span className="flex gap-2 items-center">
                <Activity size={20} /> Actions
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto">
              <Button asChild className="gap-2">
                <Link href={`/quotes/${quote.id}/edit`}>
                  <Pencil className="w-4 h-4" />
                  Edit
                </Link>
              </Button>
              <Button
                onClick={() => handleSend(quote.id, quote.client)} 
                className=" gap-2 cursor-pointer">
                <Mail className="w-4 h-4" />
                {loading ? "Sending..." : "Send to Client"}
              </Button>
              <Button variant="destructive" className="gap-2 cursor-pointer">
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
              <Button className="gap-2 cursor-pointer">
                <StickyNote className="w-4 h-4" />
                Add Notes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Items List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle>
              <span className="flex gap-2 items-center">
                <ShoppingBasket size={20} /> Products
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="items" className="border-b-0">
                <AccordionTrigger className="hover:no-underline p-0">
                  <CardTitle>Items ({quote.items.length})</CardTitle>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <Accordion type="multiple" className="space-y-2">
                    {quote.items.map((item) => (
                      <AccordionItem
                        key={item.id}
                        value={item.id}
                        className="border rounded-lg px-4"
                      >
                        <div className="flex items-center justify-between py-3">
                          <AccordionTrigger className="flex-1 text-left hover:no-underline py-0">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-muted rounded-md flex items-center justify-center text-xs">
                                {item.quantity}
                              </div>
                              <p>{item.name}</p>
                            </div>
                          </AccordionTrigger>
                          <p className="font-medium text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <AccordionContent className="pb-3 pl-9 pr-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Unit Price:
                            </span>
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex gap-2 items-center">
                <Logs size={20} /> Logs
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Logs */}
            <div className="flex gap-4 items-start overflow-x-auto">
              {logs.length === 0 && "No logs found."}
              {logs.map((log) => (
                <div key={log.id} className="flex gap-2 items-start">
                  <Circle size={16} className="text-primary" />
                  <p className="text-sm text-muted-foreground">{log.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
