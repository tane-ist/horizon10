## Environment Setup

Create a file named `.env.local` in the project root with the following keys:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Then restart the dev server:

```
npm run dev
```

Notes:
- Variables must be prefixed with `VITE_` to be available in the client.
- Do not commit secrets to version control. Prefer using `.env.local` which is typically gitignored.
