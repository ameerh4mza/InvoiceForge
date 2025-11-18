import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductSelector } from "@/components/product-selector";
import { ReceiptItemsTable } from "@/components/receipt-items-table";
import { ReceiptTotals } from "@/components/receipt-totals";
import { PaymentMethodSelector } from "@/components/payment-method-selector";
import { FileDown, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product, ReceiptItem } from "@shared/schema";
import { generateReceiptPDF } from "@/lib/pdf-generator";
import { ReceiptPrintView } from "@/components/receipt-print-view";

export default function GenerateReceipt() {
  const { toast } = useToast();
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const createReceiptMutation = useMutation({
    mutationFn: async (receiptData: {
      receiptNumber: string;
      date?: string;
      paymentMethod: string;
      subtotal: string;
      tax: string;
      total: string;
      items: string;
    }) => {
      return apiRequest("POST", "/api/receipts", receiptData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/receipts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      setItems([]);
      toast({
        title: "Receipt Created",
        description: "The receipt has been saved successfully.",
      });
    },
  });

  const productsForSelector = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: parseFloat(p.price),
  }));

  const handleAddItem = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const existingItemIndex = items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].subtotal =
        updatedItems[existingItemIndex].quantity *
        updatedItems[existingItemIndex].price;
      setItems(updatedItems);
    } else {
      const price = parseFloat(product.price);
      setItems([
        ...items,
        {
          productId,
          productName: product.name,
          quantity,
          price,
          subtotal: price * quantity,
        },
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleGeneratePDF = () => {
    if (items.length === 0) return;

    const receiptNumber = `RCT-${Date.now().toString().slice(-6)}`;
    const receiptDate = new Date();

    // Generate PDF
    generateReceiptPDF({
      receiptNumber,
      date: receiptDate,
      items,
      subtotal,
      tax,
      total,
      paymentMethod,
    });

    // Save to backend (date will be set by database)
    createReceiptMutation.mutate({
      receiptNumber,
      paymentMethod,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      items: JSON.stringify(items),
    });

    toast({
      title: "PDF Generated",
      description: "Receipt has been saved and downloaded as PDF.",
    });
  };

  const handlePrint = () => {
    if (items.length === 0) return;

    console.log("Print clicked");
    toast({
      title: "Sending to Printer",
      description: "Receipt is being sent to your default printer.",
    });

    window.print();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Generate Receipt</h1>
          <p className="text-muted-foreground">
            Create a new receipt by adding items and payment details
          </p>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <>
      <ReceiptPrintView
        receiptNumber={`RCT-${Date.now().toString().slice(-6)}`}
        date={new Date()}
        items={items}
        subtotal={subtotal}
        tax={tax}
        total={total}
        paymentMethod={paymentMethod}
      />
      <div className="max-w-4xl mx-auto space-y-6 print:hidden">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Generate Receipt</h1>
          <p className="text-muted-foreground">
            Create a new receipt by adding items and payment details
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Receipt Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center text-sm">
              <div>
                <span className="text-muted-foreground">Date: </span>
                <span className="font-medium">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Time: </span>
                <span className="font-medium">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Receipt #: </span>
                <span className="font-mono font-medium">
                  RCT-{Date.now().toString().slice(-6)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProductSelector
              products={productsForSelector}
              onAddItem={handleAddItem}
            />
            <ReceiptItemsTable items={items} onRemoveItem={handleRemoveItem} />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentMethodSelector
                value={paymentMethod}
                onChange={setPaymentMethod}
              />
            </CardContent>
          </Card>

          <ReceiptTotals subtotal={subtotal} tax={tax} total={total} />
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrint}
            disabled={items.length === 0}
            data-testid="button-print"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            size="lg"
            onClick={handleGeneratePDF}
            disabled={items.length === 0 || createReceiptMutation.isPending}
            data-testid="button-generate-pdf"
          >
            <FileDown className="w-4 h-4 mr-2" />
            {createReceiptMutation.isPending ? "Saving..." : "Generate & Save"}
          </Button>
        </div>
      </div>
    </>
  );
}
