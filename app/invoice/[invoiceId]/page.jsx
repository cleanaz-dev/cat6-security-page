// app/invoice/[invoiceId]/page.jsx
// (Same as provided earlier, repeated for clarity)
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {getData}from "@/lib/redis";

export default function InvoicePage({ params }) {
  const { invoiceId } = params;
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const data = await getData(`quote:${invoiceId}`);
        if (!data) throw new Error("Quote not found or expired");
        setQuoteData(JSON.parse(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Your Quote</h1>
      <div className="space-y-4">
        {quoteData.products.map((product) => (
          <div key={product.id} className="flex justify-between">
            <div>
              <p>{product.name}</p>
              <p className="text-gray-600">Quantity: {product.quantity}</p>
            </div>
            <p>CAD ${(product.price * product.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="border-t pt-4 font-bold flex justify-between">
          <p>Total (CAD)</p>
          <p>CAD ${quoteData.total.toFixed(2)}</p>
        </div>
      </div>
      <Button asChild className="mt-4">
        <a href={quoteData.paymentUrl} target="_blank" rel="noopener noreferrer">
          Pay Now
        </a>
      </Button>
    </div>
  );
}