import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: {
    name: string;
    description: string;
    price: string;
  }) => void;
  initialProduct?: { name: string; description: string; price: string };
}

export function ProductFormDialog({
  open,
  onOpenChange,
  onSave,
  initialProduct,
}: ProductFormDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Update form fields when initialProduct changes or dialog opens
  useEffect(() => {
    if (open && initialProduct) {
      setName(initialProduct.name || "");
      setDescription(initialProduct.description || "");
      setPrice(initialProduct.price || "");
    } else if (open && !initialProduct) {
      // Clear form for new product
      setName("");
      setDescription("");
      setPrice("");
    }
  }, [open, initialProduct]);

  const handleSave = () => {
    if (!name.trim()) {
      return; // Don't save if name is empty
    }

    onSave({ name: name.trim(), description: description.trim(), price });

    // Clear form after saving
    setName("");
    setDescription("");
    setPrice("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              data-testid="input-product-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              data-testid="input-product-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              data-testid="input-product-price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            data-testid="button-save-product"
          >
            {initialProduct ? "Update Product" : "Save Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
