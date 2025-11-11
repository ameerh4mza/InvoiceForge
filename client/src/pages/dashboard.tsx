import { useQuery } from "@tanstack/react-query";
import { AnalyticsCard } from "@/components/analytics-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, CreditCard, Banknote } from "lucide-react";

interface AnalyticsData {
  daily: { income: number; change: number };
  weekly: { income: number; change: number };
  monthly: { income: number; change: number };
  paymentMethods: {
    card: { total: number; percentage: number };
    cash: { total: number; percentage: number };
  };
  recentReceipts: Array<{
    id: string;
    number: string;
    amount: number;
    method: string;
    date: Date;
  }>;
  topProducts: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
}

export default function Dashboard() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading || !analytics) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your receipt analytics and performance</p>
        </div>
        <div className="text-center py-12 text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your receipt analytics and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard 
          title="Daily Income" 
          value={analytics.daily.income.toFixed(2)} 
          change={analytics.daily.change}
          period="vs. yesterday"
        />
        <AnalyticsCard 
          title="Weekly Income" 
          value={analytics.weekly.income.toFixed(2)} 
          change={analytics.weekly.change}
          period="vs. last week"
        />
        <AnalyticsCard 
          title="Monthly Income" 
          value={analytics.monthly.income.toFixed(2)} 
          change={analytics.monthly.change}
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
            {analytics.recentReceipts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No receipts yet. Generate your first receipt to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.recentReceipts.map((receipt) => (
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
                        <div className="text-xs text-muted-foreground">{formatTimeAgo(receipt.date)}</div>
                      </div>
                    </div>
                    <div className="font-mono font-semibold">€{receipt.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
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
            {analytics.topProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No product data yet. Start creating receipts to see top sellers.
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
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
                    <div className="font-mono font-semibold">€{product.revenue.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
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
                <span className="font-mono font-semibold">{analytics.paymentMethods.card.percentage}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-1" style={{ width: `${analytics.paymentMethods.card.percentage}%` }}></div>
              </div>
              <div className="text-xs text-muted-foreground">€{analytics.paymentMethods.card.total.toFixed(2)} total</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Cash Payments</span>
                <span className="font-mono font-semibold">{analytics.paymentMethods.cash.percentage}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-2" style={{ width: `${analytics.paymentMethods.cash.percentage}%` }}></div>
              </div>
              <div className="text-xs text-muted-foreground">€{analytics.paymentMethods.cash.total.toFixed(2)} total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
