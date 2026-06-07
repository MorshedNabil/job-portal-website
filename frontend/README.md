# Job Portal Frontend

React frontend for the Django REST job portal API.

## Run locally

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

The frontend calls the backend at `http://127.0.0.1:8000` by default. To use another API URL, create `frontend/.env`:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Included screens

- Public job search
- Login and registration for worker, company, and admin users
- Worker application history and notifications
- Company job posting and application review
- Profile and CV upload
- Admin user, job, application, and admin creation tools
