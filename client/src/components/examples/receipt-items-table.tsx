import { ReceiptItemsTable } from '../receipt-items-table';

export default function ReceiptItemsTableExample() {
  const mockItems = [
    { productId: '1', productName: 'Coffee', quantity: 2, price: 4.50, subtotal: 9.00 },
    { productId: '2', productName: 'Sandwich', quantity: 1, price: 8.99, subtotal: 8.99 },
    { productId: '3', productName: 'Cookie', quantity: 3, price: 2.50, subtotal: 7.50 },
  ];

  return (
    <ReceiptItemsTable 
      items={mockItems} 
      onRemoveItem={(index) => console.log('Remove item at index:', index)} 
    />
  );
}
