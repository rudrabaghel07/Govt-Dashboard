import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SpendingChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-600" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="text-center text-sm text-slate-500 py-6">No data found for the selected filters.</div>;
  }

  return (
    <div className="p-4">
      <h5 className="mb-3 text-lg font-semibold">Spending Overview</h5>
      <div className="w-full" style={{ height: 420, minWidth: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Department" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Allocated_Budget" fill="#4f46e5" />
            <Bar dataKey="Actual_Spend" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingChart;
