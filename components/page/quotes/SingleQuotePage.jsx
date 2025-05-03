"use client";
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
  Clock,
  Info
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuote } from "@/lib/context/QuoteProvider";

export default function SingleQuotePage({ quote }) {
  const { handleSend, loading } = useQuote();

  if (!quote) return null;

  return (
    <div className="container px-2 md:px-0 mx-auto py-4 md:py-8">
      {/* Header - Mobile Optimized */}
      <header className="mb-4 md:mb-8">
        <h1 className="text-xl md:text-3xl font-bold">
          Quote #{quote.id.slice(0, 8)}
        </h1>
        <div className="flex flex-col md:flex-row md:items-center gap-2 mt-1 md:mt-2">
          <Badge
            variant={quote.status === "pending" ? "secondary" : "default"}
            className="w-fit"
          >
            {quote.status}
          </Badge>
          <span className="text-xs md:text-sm text-muted-foreground">
            Created: {new Date(quote.createdAt).toLocaleDateString()}
          </span>
          <span className="text-xs md:text-sm text-muted-foreground">
            By: {quote.createBy || "System"}
          </span>
        </div>
      </header>

      {/* Grid Layout - Stack on Mobile */}
      <div className="grid grid-cols-1 gap-3 md:gap-6 lg:grid-cols-3">
        {/* Client Info Card */}
        <Card className="order-1">
          <CardHeader>
            <CardTitle>
              <div className="flex gap-2 items-center">
                <CircleUserRound className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                Client Information
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2 items-center">
              <User className="w-4 h-4" />
              <p className="font-medium text-sm md:text-base">
                {quote.client.name}
              </p>
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
          <CardHeader>
            <CardTitle>
              <div className="flex gap-2 items-center">
                <Wallet className="w-4 h-4 md:w-5 md:h-5 text-primary" />
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
          <CardHeader>
            <CardTitle>
              <div className="flex gap-2 items-center">
                <Activity className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                Actions
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <Button asChild className="gap-1 md:gap-2 ">
                <Link href={`/quotes/${quote.id}/edit`}>
                  <Pencil className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm">Edit Quote</span>
                </Link>
              </Button>
              <Button
                onClick={() => handleSend(quote.id, quote.client)}
                className="gap-1 md:gap-2 cursor-pointer"
                disabled={loading}
              >
                <Mail className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">
                  {loading ? "Sending..." : "Send to Client"}
                </span>
              </Button>
              <Button
                variant="destructive"
                className="gap-1 md:gap-2 cursor-pointer"
              >
                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">Delete</span>
              </Button>
              <Button className="gap-1 md:gap-2 cursor-pointer">
                <StickyNote className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">Add Notes</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Items List - Full width */}
        <Card className="order-3 lg:col-span-2 lg:order-4">
          <CardHeader>
            <CardTitle>
              <div className="flex gap-2 items-center">
                <ShoppingBasket className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                Products ({quote.items.length})
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Qty</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-center w-10">Info</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quote.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="w-6 h-6 bg-muted rounded-md flex items-center justify-center text-xs">
                  {item.quantity}
                </div>
              </TableCell>
              <TableCell className="max-w-[140px] truncate text-xs md:text-base">{item.name}</TableCell>
              <TableCell className="text-right text-xs md:text-base">${item.price.toFixed(2)}</TableCell>
              <TableCell className="text-right text-xs md:text-base">
                ${(item.price * item.quantity).toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                {item.description ? (
                  <Popover>
                    <PopoverTrigger>
                      <Info className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className=" min-w-screen text-sm bg-background ">
                      {item.description}
                    </PopoverContent>
                  </Popover>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </CardContent>
        </Card>

        {/* Activity Card */}
        {/* <Card className="order-5">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center text-sm md:text-base">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              Client Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {flattenedActivities.length === 0 ? (
              <p className="text-xs md:text-sm text-muted-foreground">
                No activity yet
              </p>
            ) : (
              flattenedActivities.map((act) => renderActivityLog(act))
            )}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
