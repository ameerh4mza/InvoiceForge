import { useState } from "react";
import { ProductFormDialog } from '../product-form-dialog';
import { Button } from "@/components/ui/button";

export default function ProductFormDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Product Form</Button>
      <ProductFormDialog
        open={open}
        onOpenChange={setOpen}
        onSave={(product) => console.log('Product saved:', product)}
      />
    </div>
  );
}
