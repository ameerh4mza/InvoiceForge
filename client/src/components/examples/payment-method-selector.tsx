import { useState } from "react";
import { PaymentMethodSelector } from '../payment-method-selector';

export default function PaymentMethodSelectorExample() {
  const [method, setMethod] = useState("card");

  return (
    <PaymentMethodSelector value={method} onChange={setMethod} />
  );
}
