import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductSelector } from "@/components/product-selector";
import { ReceiptItemsTable } from "@/components/receipt-items-table";
import { ReceiptTotals } from "@/components/receipt-totals";
import { PaymentMethodSelector } from "@/components/payment-method-selector";
import { FileDown, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReceiptItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export default function GenerateReceipt() {
  const { toast } = useToast();
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // TODO: remove mock data - replace with real products from backend
  const mockProducts = [
    { id: '1', name: 'Coffee', price: 4.50 },
    { id: '2', name: 'Sandwich', price: 8.99 },
    { id: '3', name: 'Cookie', price: 2.50 },
    { id: '4', name: 'Salad', price: 7.99 },
    { id: '5', name: 'Smoothie', price: 6.50 },
  ];

  const handleAddItem = (productId: string, quantity: number) => {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItemIndex = items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].subtotal = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
      setItems(updatedItems);
    } else {
      setItems([...items, {
        productId,
        productName: product.name,
        quantity,
        price: product.price,
        subtotal: product.price * quantity,
      }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleGeneratePDF = () => {
    console.log('Generate PDF clicked');
    toast({
      title: "PDF Generated",
      description: "Receipt has been saved and is ready for download.",
    });
  };

  const handlePrint = () => {
    console.log('Print clicked');
    toast({
      title: "Sending to Printer",
      description: "Receipt is being sent to your default printer.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Generate Receipt</h1>
        <p className="text-muted-foreground">Create a new receipt by adding items and payment details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receipt Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="text-muted-foreground">Date: </span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Time: </span>
              <span className="font-medium">{new Date().toLocaleTimeString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Receipt #: </span>
              <span className="font-mono font-medium">RCT-{Date.now().toString().slice(-6)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProductSelector products={mockProducts} onAddItem={handleAddItem} />
          <ReceiptItemsTable items={items} onRemoveItem={handleRemoveItem} />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
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
          disabled={items.length === 0}
          data-testid="button-generate-pdf"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Generate PDF
        </Button>
      </div>
    </div>
  );
}
