import { ReceiptTotals } from '../receipt-totals';

export default function ReceiptTotalsExample() {
  return (
    <div className="max-w-md">
      <ReceiptTotals subtotal={125.48} tax={10.04} total={135.52} />
    </div>
  );
}
