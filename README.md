# Sacred Falls – setup

Two Vercel projects from one repo:
1. **Website**: root folder (Next.js). Env: `NEXT_PUBLIC_API_URL` = the API's URL.
2. **API**: `backend/` (Express). Set Root Directory to `backend`. Env: see `backend/.env.example`.

Data lives in a separate PRIVATE GitHub repo (bookings are saved to `bookings/…json`; add `data/events.json` there to list upcoming events, see `backend/data-templates/events.json`).
Create a fine-grained token limited to that repo with Contents: Read and write.
