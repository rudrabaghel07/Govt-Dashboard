
const fmt = (v) => {
  if (typeof v !== 'number') return String(v || '-');
  return v.toLocaleString();
}

const SummaryCards = ({ data = [] }) => {
  const totalRows = data.length;
  const totalAllocated = data.reduce((s, r) => s + (Number(r.Allocated_Budget) || 0), 0);
  const totalActual = data.reduce((s, r) => s + (Number(r.Actual_Spend) || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="text-sm text-slate-500">Departments</div>
        <div className="text-2xl font-semibold text-slate-800">{totalRows}</div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <div className="text-sm text-slate-500">Allocated Budget</div>
        <div className="text-2xl font-semibold text-slate-800">₹ {fmt(totalAllocated)}</div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <div className="text-sm text-slate-500">Actual Spend</div>
        <div className="text-2xl font-semibold text-slate-800">₹ {fmt(totalActual)}</div>
      </div>
    </div>
  );
};

export default SummaryCards;
