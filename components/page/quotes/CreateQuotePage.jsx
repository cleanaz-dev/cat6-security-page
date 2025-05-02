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
    <div className={`container mx-auto p-6 ${isCartOpen ? "pb-24" : "pb-16"}`}>
      <header className="space-y-2">
        <p className="flex items-center justify-center text-lg">
          <Shield className="size-5 mr-1" />
          Cat6 Security
        </p>
        <h1 className="text-center text-3xl">Create Quote</h1>
      </header>
      <div className="mt-4 space-y-2">
        <Label>Select Contact</Label>
        <Select
          value={clientEmail}
          onValueChange={(value) => setClientEmail(value)}
        >
          <SelectTrigger className="w-full p-2 border rounded mb-4">
            <SelectValue placeholder="Select a contact" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectGroup>
            
              {hubspotContacts.map((contact) => (
                <SelectItem key={contact.hs_object_id} value={contact.email}>
                  {contact.firstname} <span className="text-xs text-secondary">({contact.email})</span> 
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Product Selection with Accordion */}
      <div className="mb-8">
        <Accordion type="multiple" className="w-full">
          {categorizedProducts.map(({ category, items, title }) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger className="text-lg font-semibold">
                {title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((product) => (
                    <div
                      key={product.id}
                      className={`p-4 border rounded-lg cursor-pointer ${
                        selectedProducts.some((p) => p.id === product.id)
                          ? "bg-accent border-secondary"
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() => toggleProduct(product)}
                    >
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-gray-600">
                        CAD ${product.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Sticky Cart Footer (Always Visible) */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
          {/* Cart Summary */}
          <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
            <div>
              <p className="font-semibold">
                {itemCount} Item{itemCount !== 1 ? "s" : ""}
              </p>
              <p className="text-secondary">Total: CAD ${total}</p>
            </div>
            <div className=" text-center text-muted ">
              <p className="text-xs">powered by LLM GEM</p>
            </div>
            <Button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="flex items-center cursor-pointer"
            >
              {isCartOpen ? "Collapse Quote" : "Show Quote"}
            </Button>
          </div>

          {/* Cart Details (Togglable) */}
          {isCartOpen && (
            <div className="bg-muted max-h-[70vh] overflow-y-auto transition-all duration-300 ease-in-out">
              <div className="p-4 max-w-7xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Your Quote</h2>
                <div className="space-y-3">
                  {selectedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p>{product.name}</p>
                        <div className="flex items-center mt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(
                                product.id,
                                Math.max(1, product.quantity - 1)
                              )
                            }
                          >
                            -
                          </Button>
                          <span className="mx-2">{product.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(product.id, product.quantity + 1)
                            }
                          >
                            +
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 cursor-pointer hover:bg-rose-700/40"
                            onClick={() => toggleProduct(product)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                      <p>
                        CAD ${(product.price * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Generated Link */}
                {quoteLink && (
                  <div className="mt-6 p-4 border-primary border-2 rounded-lg">
                    <p className="font-medium">Quote generated!</p>
                    <a
                      href={quoteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {quoteLink}
                    </a>
                  </div>
                )}

                {/* Error Handling */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}
                <Button
                  onClick={generateQuoteLink}
                  disabled={loading}
                  className="w-full mt-4 cursor-pointer"
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
