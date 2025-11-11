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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, Printer, Search, CreditCard, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Receipt {
  id: string;
  receiptNumber: string;
  date: string;
  itemsCount: number;
  paymentMethod: 'card' | 'cash';
  total: number;
}

export default function ReceiptHistory() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // TODO: remove mock data - replace with real receipts from backend
  const mockReceipts: Receipt[] = [
    { id: '1', receiptNumber: 'RCT-001234', date: '2024-01-15', itemsCount: 3, paymentMethod: 'card', total: 45.67 },
    { id: '2', receiptNumber: 'RCT-001235', date: '2024-01-15', itemsCount: 2, paymentMethod: 'cash', total: 23.45 },
    { id: '3', receiptNumber: 'RCT-001236', date: '2024-01-14', itemsCount: 5, paymentMethod: 'card', total: 78.90 },
    { id: '4', receiptNumber: 'RCT-001237', date: '2024-01-14', itemsCount: 1, paymentMethod: 'cash', total: 12.34 },
    { id: '5', receiptNumber: 'RCT-001238', date: '2024-01-13', itemsCount: 4, paymentMethod: 'card', total: 56.78 },
  ];

  const filteredReceipts = mockReceipts.filter(receipt => {
    const matchesSearch = receipt.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPayment = paymentFilter === "all" || receipt.paymentMethod === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  const handleViewPDF = (receiptNumber: string) => {
    console.log('View PDF for:', receiptNumber);
    toast({
      title: "Opening Receipt",
      description: `Receipt ${receiptNumber} PDF is being prepared.`,
    });
  };

  const handlePrint = (receiptNumber: string) => {
    console.log('Print receipt:', receiptNumber);
    toast({
      title: "Sending to Printer",
      description: `Receipt ${receiptNumber} is being sent to printer.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Receipt History</h1>
        <p className="text-muted-foreground">View and manage all your receipts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Receipt</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Receipt number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-receipt"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment">Payment Method</Label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger id="payment" data-testid="select-payment-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="card">Card Only</SelectItem>
                  <SelectItem value="cash">Cash Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date Range</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger id="date" data-testid="select-date-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-40 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReceipts.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell className="font-mono font-medium">{receipt.receiptNumber}</TableCell>
                <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-center">{receipt.itemsCount}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="gap-1">
                    {receipt.paymentMethod === 'card' ? (
                      <><CreditCard className="w-3 h-3" /> Card</>
                    ) : (
                      <><Banknote className="w-3 h-3" /> Cash</>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono font-semibold">€{receipt.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewPDF(receipt.receiptNumber)}
                      data-testid={`button-view-${receipt.id}`}
                    >
                      <FileDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePrint(receipt.receiptNumber)}
                      data-testid={`button-print-${receipt.id}`}
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
