import { useState, useEffect, useRef } from "react";

const Filters = ({ filters, setFilters }) => {
  const [local, setLocal] = useState({
    Year: filters.Year || "",
    Department: filters.Department || "",
    State: filters.State || "",
  });

  const [deptQuery, setDeptQuery] = useState(""); // search input for department
  const [stateQuery, setStateQuery] = useState(""); // search input for states
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);

  const deptRef = useRef(null);
  const stateRef = useRef(null);

  const apply = () => {
    const cleaned = {};
    if (local.Year) cleaned.Year = parseInt(local.Year, 10);
    if (local.Department) cleaned.Department = local.Department;
    if (local.State) cleaned.State = local.State;
    setFilters(cleaned);
  };

  const clear = () => {
    setLocal({ Year: "", Department: "", State: "" });
    setDeptQuery("");
    setStateQuery("");
    setFilters({});
  };

  // States & UTs
  const statesAndUTs = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
    "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
    "Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
    "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal",
    "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
    "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
  ];

  // Departments
  const departments = [
    "Agriculture & Farmers Welfare","Commerce & Industry","Communications",
    "Defence","Education","Electronics & IT","Environment, Forest & Climate Change",
    "Finance","Food & Public Distribution","Health & Family Welfare",
    "Heavy Industries & Public Enterprises","Home Affairs","Housing & Urban Affairs",
    "Labour & Employment","Law & Justice","Micro, Small & Medium Enterprises",
    "Power","Railways","Road Transport & Highways","Rural Development",
    "Science & Technology","Shipping","Social Justice & Empowerment",
    "Space","Steel","Textiles","Tourism","Tribal Affairs","Women & Child Development",
    "Youth Affairs & Sports","Water Resources","Petroleum & Natural Gas"
  ];

  // Generate last 30 years
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  // Filter departments
  useEffect(() => {
    setFilteredDepartments(
      departments.filter((d) =>
        d.toLowerCase().includes(deptQuery.toLowerCase())
      )
    );
  }, [deptQuery]);

  // Filter states
  useEffect(() => {
    setFilteredStates(
      statesAndUTs.filter((s) =>
        s.toLowerCase().includes(stateQuery.toLowerCase())
      )
    );
  }, [stateQuery]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (deptRef.current && !deptRef.current.contains(e.target)) setDeptQuery("");
      if (stateRef.current && !stateRef.current.contains(e.target)) setStateQuery("");
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center relative">
      {/* Year dropdown */}
      <select
        className="px-3 py-2 rounded-lg border border-slate-200 shadow-sm w-36 text-sm bg-white"
        value={local.Year}
        onChange={(e) => setLocal({ ...local, Year: e.target.value })}
      >
        <option value="">Select Year</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      {/* Department search */}
      <div className="relative w-56" ref={deptRef}>
        <input
          className="px-3 py-2 rounded-lg border border-slate-200 shadow-sm w-full text-sm"
          type="text"
          placeholder="Department"
          value={deptQuery || local.Department}
          onChange={(e) => setDeptQuery(e.target.value)}
          onFocus={() => setFilteredDepartments(departments)}
        />
        {deptQuery && filteredDepartments.length > 0 && (
          <ul className="absolute z-10 bg-white border border-slate-200 rounded-lg w-full max-h-40 overflow-y-auto mt-1 shadow-md">
            {filteredDepartments.map((d) => (
              <li
                key={d}
                className="px-3 py-1 hover:bg-sky-100 cursor-pointer"
                onClick={() => {
                  setLocal({ ...local, Department: d });
                  setDeptQuery("");
                }}
              >
                {d}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* State search dropdown */}
      <div className="relative w-52" ref={stateRef}>
        <input
          className="px-3 py-2 rounded-lg border border-slate-200 shadow-sm w-full text-sm"
          type="text"
          placeholder="State / UT"
          value={stateQuery || local.State}
          onChange={(e) => setStateQuery(e.target.value)}
          onFocus={() => setFilteredStates(statesAndUTs)}
        />
        {stateQuery && filteredStates.length > 0 && (
          <ul className="absolute z-10 bg-white border border-slate-200 rounded-lg w-full max-h-40 overflow-y-auto mt-1 shadow-md">
            {filteredStates.map((s) => (
              <li
                key={s}
                className="px-3 py-1 hover:bg-sky-100 cursor-pointer"
                onClick={() => {
                  setLocal({ ...local, State: s });
                  setStateQuery("");
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Apply / Clear */}
      <div className="flex gap-2">
        <button
          onClick={apply}
          className="bg-sky-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-sky-700 transition"
        >
          Apply
        </button>
        <button
          onClick={clear}
          className="border border-slate-200 px-3 py-2 rounded-lg text-sm hover:bg-slate-100 transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Filters;
