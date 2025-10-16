// This service now fetches real Indian Government Data from data.gov.in (safe & free)

// Fetch from data.gov.in (kept as a safe public data source)
export const getSpendingData = async (filters = {}) => {
  const API_KEY = import.meta.env.VITE_DATA_GOV_API_KEY;
  const ENDPOINT = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

  if (!API_KEY) {
    throw new Error("Missing API key. Please set VITE_DATA_GOV_API_KEY in your .env file.");
  }

  const url = `${ENDPOINT}?api-key=${API_KEY}&format=json&limit=100`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return json.records || [];
  } catch (error) {
    console.error("Error fetching data from data.gov.in:", error);
    throw error;
  }
};

// --- MongoDB Atlas Data API helper (frontend demo only) ---
// For local development: set VITE_MONGO_API_URL and VITE_MONGO_API_KEY in your .env
// Example VITE_MONGO_API_URL: https://data.mongodb-api.com/app/<app-id>/endpoint/data/v1/action/find
export const getSpendingDataFromMongoAPI = async (filters = {}) => {
  const API_URL = import.meta.env.VITE_MONGO_API_URL;
  const API_KEY = import.meta.env.VITE_MONGO_API_KEY;
  const useLocalProxy = import.meta.env.VITE_USE_LOCAL_PROXY === 'true' || import.meta.env.VITE_USE_LOCAL_PROXY === true;
  const LOCAL_PROXY_URL = import.meta.env.VITE_LOCAL_PROXY_URL || import.meta.env.VITE_PROXY_URL || null;
  const DATA_SOURCE = import.meta.env.VITE_MONGO_DATA_SOURCE || import.meta.env.VITE_MONGO_DATASOURCE || 'Cluster0';
  const DATABASE = import.meta.env.VITE_MONGO_DATABASE || 'govt_dashboard';
  const COLLECTION = import.meta.env.VITE_MONGO_COLLECTION || 'spending';

  if (!API_URL || !API_KEY) {
    throw new Error('Missing MongoDB Data API configuration. Set VITE_MONGO_API_URL and VITE_MONGO_API_KEY in .env for local development.');
  }

  // Build the request body for the Data API 'find' action
  const body = {
    dataSource: DATA_SOURCE,
    database: DATABASE,
    collection: COLLECTION,
    filter: filters || {},
    limit: 100
  };

  try {
  // Priority: explicit full local proxy URL > VITE_USE_LOCAL_PROXY flag (uses relative /api/mongo/find) > direct API URL
  const target = LOCAL_PROXY_URL ? LOCAL_PROXY_URL : (useLocalProxy ? '/api/mongo/find' : API_URL);
    const headers = { 'Content-Type': 'application/json' };
    if (!useLocalProxy) headers['api-key'] = API_KEY;

    const resp = await fetch(target, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw new Error(`Mongo Data API error: ${resp.status} ${resp.statusText} ${txt}`);
    }

    const json = await resp.json();
    // Data API returns { documents: [...] }
    return json.documents || [];
  } catch (err) {
    console.error('Error fetching data from MongoDB Data API:', err);
    throw err;
  }
};

// Test helper: performs the same POST but returns full response metadata for debugging
export const testMongoDataApi = async (filters = {}) => {
  const API_URL = import.meta.env.VITE_MONGO_API_URL;
  const API_KEY = import.meta.env.VITE_MONGO_API_KEY;
  const useLocalProxy = import.meta.env.VITE_USE_LOCAL_PROXY === 'true' || import.meta.env.VITE_USE_LOCAL_PROXY === true;
  const LOCAL_PROXY_URL = import.meta.env.VITE_LOCAL_PROXY_URL || import.meta.env.VITE_PROXY_URL || null;
  const DATA_SOURCE = import.meta.env.VITE_MONGO_DATA_SOURCE || import.meta.env.VITE_MONGO_DATASOURCE || 'Cluster0';
  const DATABASE = import.meta.env.VITE_MONGO_DATABASE || 'govt_dashboard';
  const COLLECTION = import.meta.env.VITE_MONGO_COLLECTION || 'spending';

  if (!API_URL || !API_KEY) {
    throw new Error('Missing MongoDB Data API configuration. Set VITE_MONGO_API_URL and VITE_MONGO_API_KEY in .env for local development.');
  }

  const body = {
    dataSource: DATA_SOURCE,
    database: DATABASE,
    collection: COLLECTION,
    filter: filters || {},
    limit: 5
  };

  // decide target similar to getSpendingDataFromMongoAPI
  const target = LOCAL_PROXY_URL ? LOCAL_PROXY_URL : (useLocalProxy ? '/api/mongo/find' : API_URL);
  const headers = { 'Content-Type': 'application/json' };
  if (!LOCAL_PROXY_URL && !useLocalProxy) headers['api-key'] = API_KEY;

  const resp = await fetch(target, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  const text = await resp.text().catch(() => '');
  let json = null;
  try {
    json = JSON.parse(text);
  } catch (e) {
    // not JSON
  }

  return {
    ok: resp.ok,
    status: resp.status,
    statusText: resp.statusText,
    headers: Object.fromEntries(resp.headers ? resp.headers.entries() : []),
    text,
    json
  };
};
