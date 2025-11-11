import { ProductSelector } from '../product-selector';

export default function ProductSelectorExample() {
  const mockProducts = [
    { id: '1', name: 'Coffee', price: 4.50 },
    { id: '2', name: 'Sandwich', price: 8.99 },
    { id: '3', name: 'Cookie', price: 2.50 },
  ];

  return (
    <ProductSelector 
      products={mockProducts} 
      onAddItem={(productId, quantity) => console.log('Add item:', productId, 'Qty:', quantity)} 
    />
  );
}
