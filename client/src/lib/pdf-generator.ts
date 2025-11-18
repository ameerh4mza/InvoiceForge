import jsPDF from "jspdf";
import type { ReceiptItem } from "@shared/schema";

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

  // Try to load logo from public folder
  const logoImg = new Image();
  logoImg.src = "/logo.png";

  logoImg.onload = () => {
    // If logo exists, add it to PDF
    try {
      doc.addImage(logoImg, "PNG", 80, 10, 50, 30, undefined, "FAST");
    } catch (e) {
      // If logo fails to load, use default icon
      addDefaultIcon(doc);
    }
    finalizePDF(doc, data);
  };

  logoImg.onerror = () => {
    // If logo doesn't exist, use default icon
    addDefaultIcon(doc);
    finalizePDF(doc, data);
  };

  // Trigger the load
  if (logoImg.complete) {
    logoImg.onload?.(new Event("load"));
  }
}

function addDefaultIcon(doc: jsPDF): void {
  // Add default icon (simple receipt icon using shapes)
  doc.setFillColor(59, 130, 246); // Blue color
  doc.circle(105, 25, 15, "F");

  // Receipt icon lines
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1.5);
  doc.line(98, 20, 112, 20);
  doc.line(98, 25, 112, 25);
  doc.line(98, 30, 112, 30);
}

function finalizePDF(doc: jsPDF, data: ReceiptData): void {
  // Company name
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 41, 55); // Dark gray
  doc.text("InvoiceForge", 105, 52, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128); // Gray
  doc.text("Professional Invoice & Receipt Management", 105, 60, {
    align: "center",
  });

  // Decorative line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(30, 68, 180, 68);

  // Receipt information box
  doc.setFillColor(249, 250, 251); // Light gray background
  doc.roundedRect(20, 75, 170, 28, 3, 3, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 41, 55);
  doc.text("RECEIPT DETAILS", 25, 83);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(75, 85, 99);
  doc.text(`Receipt Number:`, 25, 91);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 41, 55);
  doc.text(data.receiptNumber, 60, 91);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(75, 85, 99);
  doc.text(`Date:`, 25, 98);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 41, 55);
  doc.text(
    new Date(data.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    60,
    98
  );

  doc.setFont("helvetica", "normal");
  doc.setTextColor(75, 85, 99);
  doc.text(`Time:`, 120, 91);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 41, 55);
  doc.text(
    new Date(data.date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    145,
    91
  );

  doc.setFont("helvetica", "normal");
  doc.setTextColor(75, 85, 99);
  doc.text(`Payment:`, 120, 98);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 41, 55);
  doc.text(
    data.paymentMethod.charAt(0).toUpperCase() + data.paymentMethod.slice(1),
    145,
    98
  );

  // Items section
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 41, 55);
  doc.text("ITEMS", 25, 115);

  // Table header with background
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(20, 120, 170, 8, 2, 2, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(75, 85, 99);
  doc.text("Item", 25, 125);
  doc.text("Qty", 125, 125, { align: "right" });
  doc.text("Price", 155, 125, { align: "right" });
  doc.text("Total", 185, 125, { align: "right" });

  // Items with alternating row colors
  doc.setFont("helvetica", "normal");
  doc.setTextColor(31, 41, 55);
  let y = 135;
  data.items.forEach((item, index) => {
    if (y > 245) {
      doc.addPage();
      y = 20;
    }

    // Alternating row background
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(20, y - 5, 170, 8, "F");
    }

    doc.setFontSize(9);
    doc.text(item.productName, 25, y);
    doc.text(item.quantity.toString(), 125, y, { align: "right" });
    doc.text(`€${item.price.toFixed(2)}`, 155, y, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.text(`€${item.subtotal.toFixed(2)}`, 185, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 8;
  });

  // Totals section
  y += 5;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(120, y, 190, y);

  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(75, 85, 99);
  doc.text("Subtotal:", 130, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 41, 55);
  doc.text(`€${data.subtotal.toFixed(2)}`, 185, y, { align: "right" });

  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(75, 85, 99);
  doc.text("Tax (8%):", 130, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 41, 55);
  doc.text(`€${data.tax.toFixed(2)}`, 185, y, { align: "right" });

  // Total with highlight box
  y += 10;
  doc.setFillColor(59, 130, 246);
  doc.roundedRect(120, y - 6, 70, 12, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("Total:", 130, y + 2);
  doc.text(`€${data.total.toFixed(2)}`, 185, y + 2, { align: "right" });

  // Footer
  y += 20;
  doc.setDrawColor(226, 232, 240);
  doc.line(30, y, 180, y);

  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(59, 130, 246);
  doc.text("Thank you for your business!", 105, y, { align: "center" });

  y += 6;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text(
    "This is a computer-generated receipt and requires no signature.",
    105,
    y,
    { align: "center" }
  );

  // Save the PDF
  doc.save(`receipt-${data.receiptNumber}.pdf`);
}
