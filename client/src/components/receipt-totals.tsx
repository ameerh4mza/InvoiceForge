import { Card, CardContent } from "@/components/ui/card";

interface ReceiptTotalsProps {
  subtotal: number;
  tax: number;
  total: number;
}

export function ReceiptTotals({ subtotal, tax, total }: ReceiptTotalsProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
          <span className="text-lg font-mono" data-testid="text-subtotal">€{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">Tax</span>
          <span className="text-lg font-mono" data-testid="text-tax">€{tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-4 flex justify-between items-center">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-3xl font-mono font-bold" data-testid="text-total">€{total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
