// Use Node's global fetch (available in Node 18+)
async function run() {
  const url = 'http://localhost:4000/api/mongo/find';
  const body = {
    dataSource: 'Cluster0',
    database: 'govt_dashboard',
    collection: 'spending',
    filter: {},
    limit: 1
  };

  try {
    if (typeof fetch !== 'function') {
      console.error('Global fetch is not available in this Node runtime. Upgrade Node to 18+ or use an ESM script.');
      process.exit(2);
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const text = await res.text();
    console.log('Status:', res.status, res.statusText);
    console.log('Body:', text);
  } catch (err) {
    console.error('Request failed:', err && err.message ? err.message : String(err));
  }
}

run();
