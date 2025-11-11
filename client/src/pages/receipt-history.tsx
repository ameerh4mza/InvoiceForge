import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import type { Receipt } from "@shared/schema";

export default function ReceiptHistory() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const { data: receipts = [], isLoading } = useQuery<Receipt[]>({
    queryKey: ["/api/receipts", { paymentMethod: paymentFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (paymentFilter !== 'all') {
        params.append('paymentMethod', paymentFilter);
      }
      const response = await fetch(`/api/receipts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch receipts');
      return response.json();
    },
  });

  const filteredReceipts = receipts.filter(receipt => 
    receipt.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Receipt History</h1>
          <p className="text-muted-foreground">View and manage all your receipts</p>
        </div>
        <div className="text-center py-12 text-muted-foreground">Loading receipts...</div>
      </div>
    );
  }

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
              <Select defaultValue="all">
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
            {filteredReceipts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No receipts found. Create your first receipt to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredReceipts.map((receipt) => {
                const items = JSON.parse(receipt.items);
                return (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-mono font-medium">{receipt.receiptNumber}</TableCell>
                    <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-center">{items.length}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        {receipt.paymentMethod === 'card' ? (
                          <><CreditCard className="w-3 h-3" /> Card</>
                        ) : (
                          <><Banknote className="w-3 h-3" /> Cash</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">€{parseFloat(receipt.total).toFixed(2)}</TableCell>
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
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
