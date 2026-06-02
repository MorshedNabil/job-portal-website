# Job Portal Website - Django

Fresh Django conversion of the original job portal project.

## What is included

- Django REST Framework API
- JWT authentication
- Roles: `admin`, `worker`, `company`
- Jobs, applications, CV uploads, notifications
- Company application review
- Admin APIs plus Django Admin
- PostgreSQL database

## Setup

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
createdb job_portal
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Update `.env` if your local PostgreSQL username, password, host, port, or database name is different from the defaults in `.env.example`.

API health check:

```text
http://127.0.0.1:8000/
```

Admin:

```text
http://127.0.0.1:8000/admin/
```

## API Map

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/admin-register/`
- `GET /api/users/me/`
- `PUT /api/users/me/`
- `GET /api/jobs/`
- `POST /api/jobs/`
- `GET /api/jobs/<id>/`
- `GET /api/applications/`
- `POST /api/applications/`
- `GET /api/company/applications/`
- `PATCH /api/company/applications/<id>/status/`
- `GET /api/cv/me/`
- `POST /api/cv/`
- `GET /api/notifications/me/`
- `PATCH /api/notifications/<id>/read/`
- `GET /api/admin/users/`
- `GET /api/admin/jobs/`
- `GET /api/admin/applications/`
- `DELETE /api/admin/users/<id>/`
- `DELETE /api/admin/jobs/<id>/`
- `DELETE /api/admin/applications/<id>/`
- `PATCH /api/admin/applications/<id>/status/`
- `POST /api/admin/add/`

## Notes

The original project used MongoDB ObjectIds. This Django project uses integer primary keys by default. If you need to preserve existing MongoDB data, export users/jobs/applications from MongoDB and import them with a custom management command.
