"use client"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
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
  Clock
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useQuote } from "@/lib/context/QuoteProvider"

export default function SingleQuotePage({ quote }) {
  const { logs = [], handleSend, loading } = useQuote()
  
  if (!quote) return null

  return (
    <div className="container px-2 md:px-0 mx-auto py-4 md:py-8">
      {/* Header - Mobile Optimized */}
      <header className="mb-4 md:mb-8">
        <h1 className="text-xl md:text-3xl font-bold">
          Quote #{quote.id.slice(0, 8)}
        </h1>
        <div className="flex flex-col md:flex-row md:items-center gap-2 mt-1 md:mt-2">
          <Badge variant={quote.status === "pending" ? "secondary" : "default"} className="w-fit">
            {quote.status}
          </Badge>
          <span className="text-xs md:text-sm text-muted-foreground">
            Created: {new Date(quote.createdAt).toLocaleDateString()}
          </span>
        </div>
      </header>

      {/* Grid Layout - Stack on Mobile */}
      <div className="grid grid-cols-1 gap-3 md:gap-6 lg:grid-cols-3">
        {/* Client Info Card */}
        <Card className="order-1">
          <CardHeader >
            <CardTitle >
              <div className="flex gap-2 items-center">
              <CircleUserRound className="w-4 h-4 md:w-5 md:h-5" />
              Client Information
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2 items-center">
              <User className="w-4 h-4" />
              <p className="font-medium text-sm md:text-base">{quote.client.name}</p>
            </div>
            <div className="flex gap-2 items-center">
              <Mail className="w-4 h-4" />
              <p className="text-xs md:text-sm text-muted-foreground">
                {quote.client.email}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Hash className="w-4 h-4" />
              <p className="text-xs md:text-sm text-muted-foreground">
                HubSpot ID: {quote.client.hs_object_id}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info Card */}
        <Card className="order-2">
        <CardHeader >
            <CardTitle >
              <div className="flex gap-2 items-center">
              <Wallet className="w-4 h-4 md:w-5 md:h-5" />
              Payment Details
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm md:text-base">
              <span>Subtotal</span>
              <span>${quote.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base md:text-lg">
              <span>Total</span>
              <span>${quote.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card - Full width on mobile */}
        <Card className="order-4 lg:order-3">
        <CardHeader >
            <CardTitle >
              <div className="flex gap-2 items-center">
              <Activity className="w-4 h-4 md:w-5 md:h-5" />
              Actions
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <Button asChild size="sm" className="gap-1 md:gap-2 h-8 md:h-10">
                <Link href={`/quotes/${quote.id}/edit`}>
                  <Pencil className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm">Edit</span>
                </Link>
              </Button>
              <Button 
                onClick={() => handleSend(quote.id, quote.client)}
                size="sm" 
                className="gap-1 md:gap-2 h-8 md:h-10"
                disabled={loading}
              >
                <Mail className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">
                  {loading ? "Sending..." : "Send"}
                </span>
              </Button>
              <Button variant="destructive" size="sm" className="gap-1 md:gap-2 h-8 md:h-10">
                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">Delete</span>
              </Button>
              <Button size="sm" className="gap-1 md:gap-2 h-8 md:h-10">
                <StickyNote className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">Notes</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Items List - Full width */}
        <Card className="order-3 lg:col-span-2 lg:order-4">
        <CardHeader >
            <CardTitle >
              <div className="flex gap-2 items-center">
              <ShoppingBasket className="w-4 h-4 md:w-5 md:h-5" />
              Products ({quote.items.length})
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {quote.items.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border rounded-lg px-3 md:px-4 mb-2">
                  <div className="flex items-center justify-between py-2 md:py-3">
                    <AccordionTrigger className="flex-1 text-left hover:no-underline py-0 text-sm md:text-base">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-muted rounded-md flex items-center justify-center text-xs">
                          {item.quantity}
                        </div>
                        <p className="truncate max-w-[120px] md:max-w-none">{item.name}</p>
                      </div>
                    </AccordionTrigger>
                    <p className="font-medium text-xs md:text-sm ml-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <AccordionContent className="pb-2 md:pb-3 pl-7 md:pl-9 pr-2 space-y-1 md:space-y-2">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">Unit Price:</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                    {item.description && (
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Logs Card */}
        <Card className="order-5">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="flex gap-2 items-center text-sm md:text-base">
              <Clock className="w-4 h-4 md:w-5 md:h-5" />
              Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="space-y-3 max-h-[200px] overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-xs md:text-sm text-muted-foreground">No activity yet</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex gap-2 items-start">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-primary" />
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {log.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}