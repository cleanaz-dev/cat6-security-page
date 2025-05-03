"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Loader2, Shield, Trash2 } from "lucide-react";
import { useProductCategories } from "@/lib/hooks/useProductCategories";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { useQuote } from "@/lib/context/QuoteProvider";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

export default function CreateQuotePage() {
  const { stripeProducts, hubspotContacts } = useQuote();
  const [clientEmail, setClientEmail] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quoteLink, setQuoteLink] = useState("");
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toggle product selection
  const toggleProduct = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Update product quantity
  const updateQuantity = (id, quantity) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  // Generate quote and get shareable link
  const generateQuoteLink = async () => {
    setLoading(true);
    try {

      const contactData = hubspotContacts.find(
        (contact) => contact.email === clientEmail
      );

      if (!contactData) {
        throw new Error("Selected contact not found");
      }
      const response = await fetch("/api/test/stripe/create-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: selectedProducts, contactData }),
      });
      const { paymentUrl } = await response.json();
      setQuoteLink(paymentUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total and item count
  const total = selectedProducts
    .reduce((sum, p) => sum + p.price * p.quantity, 0)
    .toFixed(2);
  const itemCount = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);

  const categorizedProducts = useProductCategories(stripeProducts);

 
  return (
    <div className={`container mx-auto p-4 md:p-6 ${isCartOpen ? "pb-24" : "pb-16"}`}>
      <header className="space-y-2">
        <p className="flex items-center justify-center text-base md:text-lg">
          <Shield className="size-4 md:size-5 mr-1" />
          Cat6 Security
        </p>
        <h1 className="text-center text-xl md:text-3xl">Create Quote</h1>
      </header>

      {/* Contact Selection */}
      <div className=" mt-4 space-y-2">
        <Label>Select Contact</Label>
        <Select value={clientEmail} onValueChange={setClientEmail}>
          <SelectTrigger className="w-80 md:max-w-4/5 p-2 text-sm md:text-base">
            <SelectValue placeholder="Select a contact" />
          </SelectTrigger>
          <SelectContent className="bg-background  md:max-w-4/5">
            <SelectGroup>
              {hubspotContacts.map((contact) => (
               <SelectItem
               key={contact.hs_object_id}
               value={contact.email}
               className="text-sm w-80 "
             >
               <div className="flex items-center gap-1 overflow-hidden">
                 <span className="truncate">{contact.firstname}</span>
                 <span className="text-xs text-muted-foreground truncate">
                   ({contact.email})
                 </span>
               </div>
             </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Product Selection */}
      <div className="mb-4 md:mb-8">
        <Accordion type="multiple" className="w-full">
          {categorizedProducts.map(({ category, items, title }) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger className="text-base md:text-lg font-semibold px-2">
                {title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                  {items.map((product) => (
                    <div
                      key={product.id}
                      className={`p-3 md:p-4 border rounded-lg cursor-pointer ${
                        selectedProducts.some((p) => p.id === product.id)
                          ? "bg-accent border-secondary"
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() => toggleProduct(product)}
                    >
                      <h3 className="text-xs md:text-base font-medium">{product.name}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Mobile-Optimized Sticky Cart */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
          <div className="flex items-center justify-between p-3 md:p-4 max-w-7xl mx-auto gap-2">
            <div className="flex-1">
              <p className="text-xs md:text-sm font-medium">
                {itemCount} Item{itemCount !== 1 ? "s" : ""}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">CAD ${total}</p>
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground text-center">
              powered by LLM GEM
            </p>
            <Button
              onClick={() => setIsCartOpen(!isCartOpen)}
              size="sm"
              className="text-xs md:text-sm"
            >
              {isCartOpen ? "Hide" : "Show"}
            </Button>
          </div>

          {isCartOpen && (
            <div className="bg-muted md:max-h-[50vh] overflow-y-auto">
              <div className="p-3 md:p-4 max-w-7xl mx-auto">
                <h2 className="text-lg md:text-xl font-semibold mb-3">Your Quote</h2>
                <div className="space-y-2">
                  {selectedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="flex-1">
                        <p className="truncate">{product.name}</p>
                        <div className="flex items-center mt-1 gap-1">
                          <Button
                            variant="outline"
                            size="xs"
                            className="h-6 w-6 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(product.id, Math.max(1, product.quantity - 1));
                            }}
                          >
                            -
                          </Button>
                          <span className="mx-1">{product.quantity}</span>
                          <Button
                            variant="outline"
                            size="xs"
                            className="h-6 w-6 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(product.id, product.quantity + 1);
                            }}
                          >
                            +
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            className="h-6 w-6 ml-1 hover:bg-destructive/20 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleProduct(product);
                            }}
                          >
                            <Trash2 className="size-3 md:size-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm ml-2">
                        ${(product.price * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {quoteLink && (
                  <div className="mt-4 p-3 border border-primary rounded-lg">
                    <p className="text-xs md:text-sm font-medium">Quote Link:</p>
                    <a
                      href={quoteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs md:text-sm text-blue-600 underline break-all"
                    >
                      {quoteLink}
                    </a>
                  </div>
                )}

                {error && (
                  <div className="mt-3 p-2 bg-destructive/10 text-destructive text-xs md:text-sm rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  onClick={generateQuoteLink}
                  disabled={loading}
                  className="w-full mt-3 text-xs md:text-sm h-8 md:h-10"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Generate Quote"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
