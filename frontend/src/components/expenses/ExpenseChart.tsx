import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/cards/Card';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp, Users } from 'lucide-react';

interface ExpenseChartProps {
  monthlyTrend: { month: string; totalINR: number; tripCount: number }[];
  departmentBreakdown: { department: string; expenseINR: number; tripCount: number; percentageOfTotal: number }[];
  topTravellers?: { name: string; dept: string; trips: number; costInr: number }[];
}

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export const ExpenseChart: React.FC<ExpenseChartProps> = ({
  monthlyTrend,
  departmentBreakdown,
  topTravellers = [],
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Monthly Expense Trend */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            Monthly Transport Expenditure Trend
          </CardTitle>
          <span className="text-[11px] font-mono text-slate-400">INR Expenditure (₹7/km)</span>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val: any) => [`₹${val.toLocaleString()}`, 'Cost']}
                />
                <Area type="monotone" dataKey="totalINR" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Chart 2: Department-wise Expense */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-emerald-500" />
            Department Expense Distribution
          </CardTitle>
          <span className="text-[11px] font-mono text-slate-400">% Allocation</span>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={10} tickLine={false} interval={0} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val: any) => [`₹${val.toLocaleString()}`, 'Expense']}
                />
                <Bar dataKey="expenseINR" radius={[6, 6, 0, 0]}>
                  {departmentBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Chart 3: Top Travellers */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            Top Employee Commuters (Monthly Usage)
          </CardTitle>
          <span className="text-[11px] font-mono text-slate-400">Rides & Expense</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {topTravellers.map((traveller, idx) => (
              <div
                key={traveller.name}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black font-mono text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                    #{idx + 1}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">{traveller.dept}</span>
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                    {traveller.name}
                  </h5>
                  <p className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ₹{traveller.costInr} ({traveller.trips} trips)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
