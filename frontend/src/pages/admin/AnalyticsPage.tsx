import React from 'react';
import { PageHeader } from '../../components/common/headers/PageHeader';
import { MetricCard } from '../../components/common/cards/MetricCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/cards/Card';
import { BarChart3, TrendingUp, Leaf, DollarSign } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="AI Fleet Intelligence & Analytics"
        subtitle="Deep learning metrics for shuttle route efficiency, travel time savings, seat occupancy rates, and carbon offset reporting."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Fleet Utilization" value="88.4%" change={{ value: '+4.2%', type: 'increase', timeframe: 'vs last month' }} />
        <MetricCard title="On-Time Arrival Rate" value="96.2%" change={{ value: '+2.1%', type: 'increase', timeframe: 'this month' }} />
        <MetricCard title="Cost / Passenger KM" value="$0.12" change={{ value: '-8%', type: 'decrease', timeframe: 'optimized routes' }} />
        <MetricCard title="Monthly CO2 Saved" value="42.6 Tons" change={{ value: '+12%', type: 'increase', timeframe: 'sustainability goal' }} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" /> Route Optimization Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
          <p className="leading-relaxed">
            AI route recommendation models suggest shifting 2 shuttles from North Airport Line to Outer Ring Road Express between 08:30 AM and 09:30 AM to reduce wait times by 6.4 minutes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
