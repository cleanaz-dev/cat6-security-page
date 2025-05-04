import React from "react";
import InvoiceProvider from "@/lib/context/InvoiceProvider";
import InvoicesPage from "@/components/page/invoice/InvoicePage";

export default function page() {

  const invoices = []
  return (
    <>
      <InvoiceProvider data={{ invoices }}>
        <InvoicesPage />
      </InvoiceProvider>
    </>
  );
}
