import { AnalyticsCard } from '../analytics-cards';

export default function AnalyticsCardsExample() {
  return (
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
  );
}
