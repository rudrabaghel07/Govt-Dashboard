# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Setup (MongoDB Atlas Data API)

This project optionally connects directly to MongoDB Atlas Data API from the frontend for demos.

1. Create a `.env` file at the project root (next to `package.json`).
2. Add the following variables (replace values):

```
VITE_MONGO_API_URL="https://data.mongodb-api.com/app/<app-id>/endpoint/data/v1/action/find"
VITE_MONGO_API_KEY="your-atlas-data-api-key"
VITE_MONGO_DATA_SOURCE="Cluster0"
VITE_MONGO_DATABASE="govt_dashboard"
VITE_MONGO_COLLECTION="spending"
```

Important security note: storing API keys in client-side apps is insecure for production. Use this only for local development or demos. For production, proxy requests through a backend or use serverless functions that keep secrets out of the browser. Do NOT commit `.env` to source control.

### Frontend Data API demo (MongoDB Atlas)

This project includes a small frontend helper that can call the MongoDB Atlas Data API directly for demos. Put your Data API URL and key into a local `.env` file (this file should never be committed).

Create a `.env` in the project root and add the following (replace values):

```env
# Vite variables are exposed to the client. DO NOT commit these keys for production use.
VITE_MONGO_API_URL="https://data.mongodb-api.com/app/<app-id>/endpoint/data/v1/action/find"
VITE_MONGO_API_KEY="your-atlas-data-api-key"
VITE_MONGO_DATA_SOURCE="Cluster0"
VITE_MONGO_DATABASE="govt_dashboard"
VITE_MONGO_COLLECTION="spending"
```

In the code, use the provided helper in `src/services/mongoServices.js`:

- `getSpendingDataFromMongoAPI(filters)` — calls the Data API `find` action and returns an array of documents.

Security reminder: These Vite variables are embedded into the built frontend and are visible to anyone who inspects the app. For production, move Data API keys to a backend or serverless function and keep your frontend keyless.

## Tailwind CSS

This project now uses Tailwind CSS for layout and styling.

If you're updating the project locally, install the dev dependencies (tailwindcss, postcss, autoprefixer) and run the Tailwind init command which has already been run in the project. If needed, run:

```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Tailwind directives are in `src/index.css`. Components were migrated to use Tailwind utility classes.

## Node.js version

Vite requires Node.js >= 20.19.0 (or Node 22.12+). If `npm run dev` fails with a Node version error, upgrade Node locally (recommended) and re-run `npm install` and `npm run dev`.

## Connecting to MongoDB Atlas (server-side & mongosh)

If you want to test a direct connection to your MongoDB Atlas cluster from your machine using `mongosh`, use a command like this (replace username when prompted):

Windows (cmd.exe):

```
mongosh "mongodb+srv://govdashboard.8xxfpyd.mongodb.net/" --apiVersion 1 --username <your-atlas-username>
```

To connect securely from a server (recommended for production), store a server-side connection string in a `.env` file at the project root with the key `MONGO_URI`.

Create `.env` locally (example in `.env.example`) and include:

```
MONGO_URI="mongodb+srv://<username>:<password>@govdashboard.8xxfpyd.mongodb.net/govt_dashboard?retryWrites=true&w=majority"
```

Then run the provided test script from the `scripts/` folder to verify connection (install `mongodb` and `dotenv` first):

```cmd
npm install mongodb dotenv
node scripts/test-mongo-connection.js
```

The script will print a success message and the collection list if the connection works.

Security reminder: Do not store or commit production credentials in client-side code or public repositories. Use server-side secrets and environment variables.


