
const DataTable = ({ rows = [] }) => {
  if (!rows || rows.length === 0) return null;

  // pick a few keys for columns if present
  const columns = ["Department", "State", "Year", "Allocated_Budget", "Actual_Spend"];

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full bg-white rounded border">
        <thead>
          <tr className="text-left text-sm text-slate-600 border-b">
            {columns.map((c) => (
              <th key={c} className="px-3 py-2">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-slate-50" : "bg-white"}>
              {columns.map((c) => (
                <td key={c} className="px-3 py-2 text-sm text-slate-700">{String(r[c] ?? "-")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
