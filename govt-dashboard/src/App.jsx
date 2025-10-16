import { useEffect, useState, useMemo } from "react";
import "./App.css";
import DataTable from "./components/DataTable";
import Filters from "./components/Filters";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import SpendingChart from "./components/SpendingCharts";
import SummaryCards from "./components/SummaryCards";
import { getSpendingData, getSpendingDataFromMongoAPI } from "./services/mongoServices";

function App() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const useMongoApi = useMemo(() => Boolean(import.meta.env.VITE_MONGO_API_URL), []);
  const fetcher = useMemo(() => (useMongoApi ? getSpendingDataFromMongoAPI : getSpendingData), [useMongoApi]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetcher(filters)
      .then((res) => {
        if (mounted) setData(res || []);
      })
      .catch((err) => {
        const msg = err?.message || String(err);
        if (mounted) setError(msg);
        console.error('Data fetch error (fetcher=', useMongoApi ? 'mongo' : 'data.gov', '):', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [filters, fetcher, useMongoApi]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Nav />

      <main className="w-full flex flex-col justify-center items-center my-8 px-4 flex-1">
        {/* Dashboard Title */}
        <div className="text-center mb-6 w-full">
          <h2 className="text-2xl font-bold text-slate-900">Government Data Transparency Dashboard</h2>
          <p className="text-sm text-slate-500">Interactive view of allocated budget vs actual spending.</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 w-full flex flex-col items-center">
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 mb-6 w-full">
            <Filters filters={filters} setFilters={setFilters} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-sm text-red-700 bg-red-50 p-3 rounded w-full text-center">
              {error} <span className="italic">(Try adjusting filters or check API keys)</span>
            </div>
          )}

          {/* Summary Cards */}
          <div className="mt-6 w-full">
            <SummaryCards data={data} loading={loading} fullWidth />
          </div>

          {/* Chart */}
          <div className="mt-6 w-full">
            <SpendingChart data={data} loading={loading} fullWidth />
          </div>

          {/* Data Table */}
          <div className="mt-6 w-full">
            <DataTable rows={data} loading={loading} fullWidth />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
  