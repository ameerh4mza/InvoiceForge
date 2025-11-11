import { AnalyticsCard } from "@/components/analytics-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, CreditCard, Banknote } from "lucide-react";

export default function Dashboard() {
  // TODO: remove mock data - replace with real analytics from backend
  const recentReceipts = [
    { id: '1', number: 'RCT-001238', time: '2 hours ago', amount: 45.67, method: 'card' as const },
    { id: '2', number: 'RCT-001237', time: '4 hours ago', amount: 23.45, method: 'cash' as const },
    { id: '3', number: 'RCT-001236', time: '6 hours ago', amount: 78.90, method: 'card' as const },
  ];

  const topProducts = [
    { name: 'Coffee', count: 45, revenue: 202.50 },
    { name: 'Sandwich', count: 32, revenue: 287.68 },
    { name: 'Smoothie', count: 28, revenue: 182.00 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your receipt analytics and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard 
          title="Daily Income" 
          value="$1,234.56" 
          change={12.5}
          period="vs. yesterday"
        />
        <AnalyticsCard 
          title="Weekly Income" 
          value="$8,567.89" 
          change={-3.2}
          period="vs. last week"
        />
        <AnalyticsCard 
          title="Monthly Income" 
          value="$32,145.78" 
          change={18.7}
          period="vs. last month"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Recent Receipts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReceipts.map((receipt) => (
                <div key={receipt.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      {receipt.method === 'card' ? (
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Banknote className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="font-mono font-medium text-sm">{receipt.number}</div>
                      <div className="text-xs text-muted-foreground">{receipt.time}</div>
                    </div>
                  </div>
                  <div className="font-mono font-semibold">${receipt.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center rounded-full">
                      {index + 1}
                    </Badge>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.count} sold</div>
                    </div>
                  </div>
                  <div className="font-mono font-semibold">${product.revenue.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Card Payments</span>
                <span className="font-mono font-semibold">65%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-1" style={{ width: '65%' }}></div>
              </div>
              <div className="text-xs text-muted-foreground">$21,394.76 total</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Cash Payments</span>
                <span className="font-mono font-semibold">35%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-2" style={{ width: '35%' }}></div>
              </div>
              <div className="text-xs text-muted-foreground">$10,751.02 total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
