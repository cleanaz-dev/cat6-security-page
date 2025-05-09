"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Loader2, Trash2 } from 'lucide-react';
import { useQuote } from '@/lib/context/QuoteProvider';
import { useProductCategories } from "@/lib/hooks/useProductCategories";
import { Badge } from '@/components/ui/badge';

export default function EditQuotePage({ quote }) {
  const { stripeProducts, hubspotContacts } = useQuote();
  const {
    id,
    url,
    client = { firstname: '', email: '', hs_object_id: '' },
    items: initialItems = [],
    total: initialTotal,
    status
  } = quote || {};

  const [selectedProducts, setSelectedProducts] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();

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

  // Save changes to quote
  const saveQuote = async () => {
    setLoading(true);
    setError("")
    try {
      const response = await fetch(`/api/quotes/${id}/edit-quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: selectedProducts,
        })
      });
      
      if (!response.ok) throw new Error('Failed to update quote');
      router.push('/quotes');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2);
  };

  const itemCount = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
  const categorizedProducts = useProductCategories(stripeProducts); // Reuse your existing hook

  return (
    <div className={`container mx-auto p-4 md:p-6 ${isCartOpen ? 'pb-24' : 'pb-16'}`}>
      <header className="space-y-2">
        <h1 className="text-xl md:text-2xl">Edit Quote #{id.slice(0, 8)}</h1>
        <div className="flex items-center gap-2">
         <Badge variant={status === 'followUp' ? 'warning' : 'success'}>
            {status}
          </Badge>
          {/* {url && (
            <Button variant="link" size="sm" asChild>
              <a href={url} target="_blank" rel="noopener noreferrer">
                View Latest PDF
              </a>
            </Button>
          )} */}
        </div>
      </header>

      {/* Client Information (Read-only) */}
      <div className="mt-4 space-y-2">
        <Label><span className='text-xl'>Client</span></Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className='space-y-2'>
            <Label>Name</Label>
            <Input
              className="text-muted-foreground" 
              value={client.name} 
              readOnly />
          </div>
            <div className='space-y-2'>
            <Label>Email</Label>
            <Input 
              className="text-muted-foreground"
              value={client.email} 
              readOnly />
          </div>
        </div>
      </div>

      {/* Product Selection (Same as Create) */}
      <div className="mb-4 md:mb-8 mt-6">
        <Accordion type="multiple" className="w-full" defaultValue={categorizedProducts.map(c => c.category)}>
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
                          ? 'bg-accent border-secondary'
                          : 'hover:bg-primary/10'
                      }`}
                      onClick={() => toggleProduct(product)}
                    >
                      <h3 className="text-xs md:text-base font-medium">
                        {product.name}
                      </h3>
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

      {/* Sticky Cart (Same as Create) */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
          <div className="flex items-center justify-between p-3 md:p-4 max-w-7xl mx-auto gap-2">
            <div className="flex-1">
              <p className="text-xs md:text-sm font-medium">
                {itemCount} Item{itemCount !== 1 ? 's' : ''}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                ${calculateTotal()}
              </p>
            </div>
            <Button
              onClick={() => setIsCartOpen(!isCartOpen)}
              size="sm"
              className="text-xs md:text-sm"
            >
              {isCartOpen ? 'Hide' : 'Show'} Cart
            </Button>
          </div>

          {isCartOpen && (
            <div className="bg-muted md:max-h-[50vh] overflow-y-auto overscroll-contain touch-pan-y">
              <div className="p-3 md:p-4 max-w-7xl mx-auto">
                <h2 className="text-lg md:text-xl font-semibold mb-3">
                  Quote Items
                </h2>
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
                            className="h-6 w-6"
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
                            className="h-6 w-6"
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
                            className="h-6 w-6 ml-1 hover:bg-destructive/20"
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

                <div className="mt-4 pt-2 border-t">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>

                {error && (
                  <div className="mt-3 p-2 bg-destructive/10 text-destructive text-xs md:text-sm rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/quotes')}
                    className="text-xs md:text-sm h-8 md:h-10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveQuote}
                    disabled={loading}
                    className="text-xs md:text-sm h-8 md:h-10"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Update Quote'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}