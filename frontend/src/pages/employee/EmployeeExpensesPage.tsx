import React, { useMemo, useState } from 'react';
import { PageHeader } from '../../components/common/headers/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/cards/Card';
import { Table } from '../../components/common/tables/Table';
import { Button } from '../../components/common/buttons/Button';
import { useEmployeeExpenses } from '../../hooks/useExpenses';
import { useRoutes } from '../../hooks/useRoutes';
import {
  ShieldCheck,
  CheckCircle2,
  Download,
  MapPin,
  TrendingUp,
  Receipt,
  Route,
  Zap,
  IndianRupee,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';

export const EmployeeExpensesPage: React.FC = () => {
  const { data: exp, isLoading } = useEmployeeExpenses();
  const { allRoutes } = useRoutes();
  const [selectedPeriod, setSelectedPeriod] = useState('CURRENT');

  const routeDistanceMap = useMemo(
    () => Object.fromEntries(allRoutes.map((route) => [String(route.name).trim().toLowerCase(), Number(route.totalDistanceKm || 0)])),
    [allRoutes],
  );

  const getDistanceForRoute = (routeName?: string) => {
    if (!routeName) return 0;
    return Number(routeDistanceMap[String(routeName).trim().toLowerCase()] ?? 0);
  };

  const totalDistanceTravelledKm = (exp?.recentTrips || []).reduce((sum, trip) => sum + getDistanceForRoute(trip.routeName), 0);
  const totalTravelCostInr = exp?.totalSubsidizedINR || 0;

  const handleDownloadStatement = () => {
    toast.success('Downloading Monthly Transport Subsidy Statement PDF...');
  };

  const trendData = exp?.expenseTrend || [];

  const columns = [
    {
      key: 'date',
      header: 'Travel Date',
      render: (r: any) => <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{r.date}</span>,
    },
    {
      key: 'routeName',
      header: 'Shuttle Route & Stops',
      render: (r: any) => (
        <div>
          <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{r.routeName}</p>
          <p className="text-[11px] text-slate-500">{r.pickupStop} &rarr; {r.dropStop}</p>
        </div>
      ),
    },
    {
      key: 'valueINR',
      header: 'Commute Value',
      render: (r: any) => {
        const costInr = Number(r.valueINR || 0);
        return (
          <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
            ₹{costInr.toFixed(2)}
          </span>
        );
      },
    },
    {
      key: 'subsidy',
      header: 'Employee Cost',
      render: (r: any) => {
        const costInr = Number(r.valueINR || 0);
        return (
          <span className="font-bold text-xs text-slate-500">
            ₹{costInr.toFixed(2)} (₹7/km)
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (r: any) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> {r.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-6xl">
      <PageHeader
        title="My Transport Expenses"
        subtitle="Track your monthly employer-sponsored transport benefit. Employees never pay directly during booking."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadStatement}
            leftIcon={<Receipt className="w-4 h-4" />}
          >
            Download Tax Statement
          </Button>
        }
      />

      {/* Zero Direct Payment Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white">Direct Employer Subsidy Enrolled</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500 text-slate-950">
                Zero Payment Required
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              All Off-Go shuttle rides are billed directly to your organization. No out-of-pocket expenses required.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedPeriod('CURRENT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedPeriod === 'CURRENT'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Current Month ({exp?.currentMonth || 'Current month'})
          </button>
          <button
            onClick={() => setSelectedPeriod('PREVIOUS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedPeriod === 'PREVIOUS'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Previous Months
          </button>
        </div>
      </div>

      {/* Key Metric Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Route className="w-3.5 h-3.5 text-indigo-400" />
            Trips Completed
          </span>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {exp?.totalTripsThisMonth ?? 0} Rides
          </h4>
          <p className="text-[11px] text-slate-500">Commute Dispatches</p>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            Monthly Distance
          </span>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {totalDistanceTravelledKm.toFixed(1)} km
          </h4>
          <p className="text-[11px] text-slate-500">Distance Travelled</p>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            Monthly Expense (Employer Covered)
          </span>
          <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            ₹{totalTravelCostInr.toFixed(2)}
          </h4>
          <p className="text-[11px] text-slate-500">₹7 per km</p>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Average Cost Per Trip
          </span>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            ₹{(totalTravelCostInr / Math.max(exp?.totalTripsThisMonth || 1, 1)).toFixed(2)}
          </h4>
          <p className="text-[11px] text-slate-500">Cost per ride</p>
        </Card>
      </div>

      {/* Expense Trend Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            6-Month Expense Trend & Commute Value
          </CardTitle>
          <span className="text-[11px] font-mono text-slate-400">Employer Covered (₹7/km)</span>
        </CardHeader>
        <CardContent>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="empCostGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val: any) => [`₹${val}`, 'Transport Benefit']}
                />
                <Area type="monotone" dataKey="expenseInr" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#empCostGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Trips Record */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Commute Dispatches ({selectedPeriod === 'CURRENT' ? exp?.currentMonth || 'Current month' : 'Prior Months'})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            data={exp?.recentTrips || []}
            columns={columns}
            isLoading={isLoading}
            keyExtractor={(item, index) => `${item.date}-${index}`}
            emptyMessage="No commute records found for selected period."
          />
        </CardContent>
      </Card>
    </div>
  );
};
