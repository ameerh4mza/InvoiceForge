import jsPDF from 'jspdf';
import type { ReceiptItem } from '@shared/schema';

interface ReceiptData {
  receiptNumber: string;
  date: Date;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
}

export function generateReceiptPDF(data: ReceiptData): void {
  const doc = new jsPDF();
  
  // Company header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Receipt Manager', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Professional Receipt System', 105, 28, { align: 'center' });
  
  // Receipt details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Receipt #: ${data.receiptNumber}`, 20, 45);
  doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, 20, 52);
  doc.text(`Time: ${new Date(data.date).toLocaleTimeString()}`, 20, 59);
  doc.text(`Payment: ${data.paymentMethod.charAt(0).toUpperCase() + data.paymentMethod.slice(1)}`, 20, 66);
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, 72, 190, 72);
  
  // Items table header
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Product', 20, 80);
  doc.text('Qty', 120, 80, { align: 'right' });
  doc.text('Price', 150, 80, { align: 'right' });
  doc.text('Subtotal', 180, 80, { align: 'right' });
  
  // Items
  doc.setFont('helvetica', 'normal');
  let y = 88;
  data.items.forEach((item, index) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    
    doc.text(item.productName, 20, y);
    doc.text(item.quantity.toString(), 120, y, { align: 'right' });
    doc.text(`€${item.price.toFixed(2)}`, 150, y, { align: 'right' });
    doc.text(`€${item.subtotal.toFixed(2)}`, 180, y, { align: 'right' });
    y += 8;
  });
  
  // Line separator
  y += 5;
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  
  // Totals
  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', 130, y);
  doc.text(`€${data.subtotal.toFixed(2)}`, 180, y, { align: 'right' });
  
  y += 8;
  doc.text('Tax (8%):', 130, y);
  doc.text(`€${data.tax.toFixed(2)}`, 180, y, { align: 'right' });
  
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total:', 130, y);
  doc.text(`€${data.total.toFixed(2)}`, 180, y, { align: 'right' });
  
  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your business!', 105, 280, { align: 'center' });
  
  // Save the PDF
  doc.save(`receipt-${data.receiptNumber}.pdf`);
}
