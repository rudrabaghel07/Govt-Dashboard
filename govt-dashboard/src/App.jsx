import { useEffect, useState } from "react";
import "./App.css";
import DataTable from "./components/DataTable";
import Filters from "./components/Filters";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import SpendingChart from "./components/SpendingCharts";
import SummaryCards from "./components/SummaryCards";
import { getSpendingData, getSpendingDataFromMongoAPI, testMongoDataApi } from "./services/mongoServices";
import { exportToCsv } from "./utils/exportCsv";

function App() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugResult, setDebugResult] = useState(null);
  const [debugLoading, setDebugLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    // Prefer MongoDB Data API if configured; otherwise fallback to data.gov.in
    const useMongoApi = Boolean(import.meta.env.VITE_MONGO_API_URL);
    const fetcher = useMongoApi ? getSpendingDataFromMongoAPI : getSpendingData;

    fetcher(filters)
      .then((res) => {
        if (mounted) setData(res || []);
      })
      .catch((err) => {
        // Provide richer error details for debugging
        const msg = err && err.message ? err.message : String(err);
        if (mounted) setError(msg);
        console.error('Data fetch error (fetcher=', useMongoApi ? 'mongo' : 'data.gov', '):', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Nav />

      <main className="max-w-6xl mx-auto my-8 px-4 flex-1">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Government Data Transparency Dashboard</h2>
          <p className="text-sm text-slate-500">Interactive view of allocated budget vs actual spending.</p>
        </div>

        <div className="mb-4">
          <div className="rounded-md bg-blue-50 border border-blue-100 p-3 text-sm text-blue-800">
            This demo connects directly to MongoDB Atlas Data API from the frontend. For local
            development put your API URL and key in a <code>.env</code> file as <code>VITE_MONGO_API_URL</code>
            and <code>VITE_MONGO_API_KEY</code>. Do not commit the key to source control.
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Filters filters={filters} setFilters={setFilters} />
            <div className="flex gap-2">
              <button onClick={() => exportToCsv('spending-export.csv', data)} className="px-3 py-2 bg-sky-600 text-white rounded">Export CSV</button>
              <button
                onClick={async () => {
                  setDebugLoading(true);
                  setDebugResult(null);
                  try {
                    const res = await testMongoDataApi(filters);
                    setDebugResult(res);
                  } catch (err) {
                    setDebugResult({ error: err.message || String(err) });
                  } finally {
                    setDebugLoading(false);
                  }
                }}
                className="px-3 py-2 bg-amber-600 text-white rounded"
              >
                {debugLoading ? 'Testing...' : 'Test Data API'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-700 bg-red-50 p-3 rounded">{error}</div>
          )}

          <div className="mt-6">
            <SummaryCards data={data} />
          </div>

          {debugResult && (
            <div className="mt-4 bg-gray-50 border border-gray-200 p-3 rounded text-sm">
              <div className="font-medium mb-2">Data API test result</div>
              {debugResult.error ? (
                <div className="text-red-700">Error: {debugResult.error}</div>
              ) : (
                <div>
                  <div>Status: {debugResult.status} {debugResult.statusText}</div>
                  <div className="mt-2">Headers: <pre className="whitespace-pre-wrap">{JSON.stringify(debugResult.headers, null, 2)}</pre></div>
                  <div className="mt-2">Body: <pre className="whitespace-pre-wrap">{debugResult.text || JSON.stringify(debugResult.json, null, 2)}</pre></div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <SpendingChart data={data} loading={loading} />
          </div>

          <DataTable rows={data} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
