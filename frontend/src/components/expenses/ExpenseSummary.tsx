import React from 'react';
import { Card } from '../common/cards/Card';
import { Users, Route, IndianRupee, TrendingUp, Award, CheckCircle2 } from 'lucide-react';

interface ExpenseSummaryProps {
  totalEmployees: number;
  totalTrips: number;
  totalMonthlyCostInr: number;
  avgCostPerEmployeeInr: number;
  highestUsageEmployee: { name: string; dept: string; trips: number; costInr: number };
  lowestUsageEmployee: { name: string; dept: string; trips: number; costInr: number };
}

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({
  totalEmployees,
  totalTrips,
  totalMonthlyCostInr,
  avgCostPerEmployeeInr,
  highestUsageEmployee,
  lowestUsageEmployee,
}) => {
  const cards = [
    {
      title: 'Total Employees Covered',
      value: totalEmployees.toLocaleString(),
      subtext: 'Active commuters enrolled',
      icon: Users,
      color: 'border-indigo-500/20 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10',
    },
    {
      title: 'Total Monthly Trips',
      value: totalTrips.toLocaleString(),
      subtext: 'Completed dispatches',
      icon: Route,
      color: 'border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-500/10',
    },
    {
      title: 'Total Monthly Transport Cost',
      value: `₹${totalMonthlyCostInr.toLocaleString()}`,
      subtext: 'Employer internal expenditure',
      icon: IndianRupee,
      color: 'border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    },
    {
      title: 'Avg Cost Per Employee',
      value: `₹${avgCostPerEmployeeInr.toFixed(2)}`,
      subtext: 'Per active seat / month',
      icon: TrendingUp,
      color: 'border-purple-500/20 text-purple-600 dark:text-purple-400 bg-purple-500/10',
    },
    {
      title: 'Highest Usage Employee',
      value: highestUsageEmployee.name,
      subtext: `${highestUsageEmployee.trips} trips (₹${highestUsageEmployee.costInr})`,
      icon: Award,
      color: 'border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-500/10',
    },
    {
      title: 'Lowest Usage Employee',
      value: lowestUsageEmployee.name,
      subtext: `${lowestUsageEmployee.trips} trips (₹${lowestUsageEmployee.costInr})`,
      icon: CheckCircle2,
      color: 'border-teal-500/20 text-teal-600 dark:text-teal-400 bg-teal-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.title} className="p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                {c.title}
              </span>
              <div className={`p-2 rounded-xl ${c.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white font-mono truncate">
                {c.value}
              </h4>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {c.subtext}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
