import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface ProductSelectorProps {
  products: Product[];
  onAddItem: (productId: string, quantity: number) => void;
}

export function ProductSelector({ products, onAddItem }: ProductSelectorProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");

  const handleAdd = () => {
    if (selectedProductId && quantity) {
      onAddItem(selectedProductId, parseInt(quantity));
      setSelectedProductId("");
      setQuantity("1");
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex-1 min-w-[200px] space-y-2">
        <Label htmlFor="product">Select Product</Label>
        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
          <SelectTrigger id="product" data-testid="select-product">
            <SelectValue placeholder="Choose a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} - ${product.price.toFixed(2)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-32 space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          data-testid="input-quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      {selectedProduct && (
        <div className="min-w-[120px] text-right space-y-2">
          <Label className="text-muted-foreground">Subtotal</Label>
          <div className="text-lg font-mono font-semibold">
            ${(selectedProduct.price * parseInt(quantity || "0")).toFixed(2)}
          </div>
        </div>
      )}
      <Button onClick={handleAdd} disabled={!selectedProductId} data-testid="button-add-item">
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
}
