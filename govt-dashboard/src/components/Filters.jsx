import { useState } from "react";

const Filters = ({ filters, setFilters }) => {
  const [local, setLocal] = useState({
    Year: filters.Year || "",
    Department: filters.Department || "",
    State: filters.State || "",
  });

  const apply = () => {
    const cleaned = {};
    if (local.Year) cleaned.Year = parseInt(local.Year, 10);
    if (local.Department) cleaned.Department = local.Department;
    if (local.State) cleaned.State = local.State;
    setFilters(cleaned);
  };

  const clear = () => {
    setLocal({ Year: "", Department: "", State: "" });
    setFilters({});
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center">
      <input
        className="px-3 py-2 rounded-lg border border-slate-200 shadow-sm w-36 text-sm"
        type="number"
        placeholder="Year"
        value={local.Year}
        onChange={(e) => setLocal({ ...local, Year: e.target.value })}
      />
      <input
        className="px-3 py-2 rounded-lg border border-slate-200 shadow-sm w-56 text-sm"
        type="text"
        placeholder="Department"
        value={local.Department}
        onChange={(e) => setLocal({ ...local, Department: e.target.value })}
      />
      <input
        className="px-3 py-2 rounded-lg border border-slate-200 shadow-sm w-44 text-sm"
        type="text"
        placeholder="State"
        value={local.State}
        onChange={(e) => setLocal({ ...local, State: e.target.value })}
      />

      <div className="flex gap-2">
        <button onClick={apply} className="bg-sky-600 text-white px-3 py-2 rounded-lg text-sm">
          Apply
        </button>
        <button onClick={clear} className="border border-slate-200 px-3 py-2 rounded-lg text-sm">
          Clear
        </button>
      </div>
    </div>
  );
};

export default Filters;
