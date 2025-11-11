import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CreditCard, Banknote } from "lucide-react";

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Payment Method</Label>
      <ToggleGroup type="single" value={value} onValueChange={onChange} className="justify-start">
        <ToggleGroupItem value="card" aria-label="Card" data-testid="toggle-card" className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Card
        </ToggleGroupItem>
        <ToggleGroupItem value="cash" aria-label="Cash" data-testid="toggle-cash" className="flex items-center gap-2">
          <Banknote className="w-4 h-4" />
          Cash
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
