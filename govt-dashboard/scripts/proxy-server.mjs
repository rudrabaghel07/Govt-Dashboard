#!/usr/bin/env node
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PROXY_PORT || 4000;

app.use(cors());
app.use(express.json());

const API_URL = process.env.MONGO_DATA_API_URL || process.env.VITE_MONGO_API_URL;
const API_KEY = process.env.MONGO_DATA_API_KEY || process.env.VITE_MONGO_API_KEY;

if (!API_URL || !API_KEY) {
  console.warn('Warning: proxy server started without MONGO_DATA_API_URL or MONGO_DATA_API_KEY in environment. Requests will fail.');
}

app.post('/api/mongo/find', async (req, res) => {
  try {
    console.log('Proxy received request:', req.method, req.url);
    console.log('Request body sample:', JSON.stringify(req.body).slice(0, 1000));
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY
      },
      body: JSON.stringify(req.body)
    });

    const text = await resp.text();
    console.log('Upstream response status:', resp.status, resp.statusText);
    console.log('Upstream response body (truncated):', String(text).slice(0, 2000));
    // forward status, headers and body
    try {
      res.status(resp.status).set(Object.fromEntries(resp.headers.entries())).send(text);
    } catch (e) {
      // sometimes setting headers may fail if headers contain forbidden values; fallback to send body only
      console.error('Failed to forward headers to client:', e);
      res.status(resp.status).send(text);
    }
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Dev proxy listening on http://localhost:${PORT}`);
  console.log('POST /api/mongo/find will be forwarded to:', API_URL ? API_URL : '<not-set>');
});
