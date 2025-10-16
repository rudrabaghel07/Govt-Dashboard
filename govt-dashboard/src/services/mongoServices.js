// services/mongoServices.js

// --- Fetch from data.gov.in (official Indian Government open data) ---
export const getSpendingData = async (filters = {}) => {
  const API_KEY = import.meta.env.VITE_DATA_GOV_API_KEY;
  const ENDPOINT = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

  if (!API_KEY) throw new Error("Missing API key. Set VITE_DATA_GOV_API_KEY in .env");

  // Build filter query params for data.gov.in
  const params = new URLSearchParams({
    'api-key': API_KEY,
    format: "json",
    limit: 5000, // maximum allowed in a single fetch
  });

  if (filters.Year) params.append("filters[Year]", filters.Year);
  if (filters.Department) params.append("filters[Department]", filters.Department);
  if (filters.State) params.append("filters[State]", filters.State);

  try {
    const response = await fetch(`${ENDPOINT}?${params.toString()}`);
    if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
    const json = await response.json();
    return json.records || [];
  } catch (err) {
    console.error("Error fetching data from data.gov.in:", err);
    throw err;
  }
};

// --- MongoDB Atlas Data API helper ---
export const getSpendingDataFromMongoAPI = async (filters = {}) => {
  const API_URL = import.meta.env.VITE_MONGO_API_URL;
  const API_KEY = import.meta.env.VITE_MONGO_API_KEY;
  const useLocalProxy = import.meta.env.VITE_USE_LOCAL_PROXY === "true";
  const LOCAL_PROXY_URL = import.meta.env.VITE_LOCAL_PROXY_URL || import.meta.env.VITE_PROXY_URL || null;
  const DATA_SOURCE = import.meta.env.VITE_MONGO_DATA_SOURCE || "Cluster0";
  const DATABASE = import.meta.env.VITE_MONGO_DATABASE || "govt_dashboard";
  const COLLECTION = import.meta.env.VITE_MONGO_COLLECTION || "spending";

  if (!API_URL || !API_KEY) throw new Error("Missing MongoDB Data API configuration.");

  // MongoDB filters: map frontend filters to MongoDB query
  const mongoFilter = {};
  if (filters.Year) mongoFilter.Year = parseInt(filters.Year, 10);
  if (filters.Department) mongoFilter.Department = filters.Department;
  if (filters.State) mongoFilter.State = filters.State;

  const body = {
    dataSource: DATA_SOURCE,
    database: DATABASE,
    collection: COLLECTION,
    filter: mongoFilter,
    limit: 5000, // fetch a large chunk
  };

  const target = LOCAL_PROXY_URL ? LOCAL_PROXY_URL : useLocalProxy ? "/api/mongo/find" : API_URL;
  const headers = { "Content-Type": "application/json" };
  if (!useLocalProxy && !LOCAL_PROXY_URL) headers["api-key"] = API_KEY;

  try {
    const resp = await fetch(target, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new Error(`Mongo Data API error: ${resp.status} ${resp.statusText} ${txt}`);
    }
    const json = await resp.json();
    return json.documents || [];
  } catch (err) {
    console.error("Error fetching data from MongoDB Data API:", err);
    throw err;
  }
};

// --- Optional debug/test helper ---
export const testMongoDataApi = async (filters = {}) => {
  const API_URL = import.meta.env.VITE_MONGO_API_URL;
  const API_KEY = import.meta.env.VITE_MONGO_API_KEY;
  const useLocalProxy = import.meta.env.VITE_USE_LOCAL_PROXY === "true";
  const LOCAL_PROXY_URL = import.meta.env.VITE_LOCAL_PROXY_URL || import.meta.env.VITE_PROXY_URL || null;
  const DATA_SOURCE = import.meta.env.VITE_MONGO_DATA_SOURCE || "Cluster0";
  const DATABASE = import.meta.env.VITE_MONGO_DATABASE || "govt_dashboard";
  const COLLECTION = import.meta.env.VITE_MONGO_COLLECTION || "spending";

  const mongoFilter = {};
  if (filters.Year) mongoFilter.Year = parseInt(filters.Year, 10);
  if (filters.Department) mongoFilter.Department = filters.Department;
  if (filters.State) mongoFilter.State = filters.State;

  const body = { dataSource: DATA_SOURCE, database: DATABASE, collection: COLLECTION, filter: mongoFilter, limit: 5 };

  const target = LOCAL_PROXY_URL ? LOCAL_PROXY_URL : useLocalProxy ? "/api/mongo/find" : API_URL;
  const headers = { "Content-Type": "application/json" };
  if (!useLocalProxy && !LOCAL_PROXY_URL) headers["api-key"] = API_KEY;

  const resp = await fetch(target, { method: "POST", headers, body: JSON.stringify(body) });
  const text = await resp.text().catch(() => "");
  let json = null;
  try { json = JSON.parse(text); } catch {}
  return { ok: resp.ok, status: resp.status, statusText: resp.statusText, headers: Object.fromEntries(resp.headers?.entries() || []), text, json };
};
