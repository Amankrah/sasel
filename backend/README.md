# SASEL Lab Website Backend

This is the backend for the SASEL Lab website at McGill University, built with Django 5.1.

## Features

- Complete content management system for:
  - Lab members (professor, research assistants, students, etc.)
  - Projects (current and past)
  - Collaborations (other labs, provincial, national, international)
  - Grants
  - Awards
  - Publications
  - Partnerships
- REST API endpoints for all content types
- Support for various media types (images, videos, audio, documents)
- Admin interface for easy content management

## Requirements

- Python 3.10+
- Virtual environment (recommended)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd sasel_lab_site
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```
   python manage.py migrate
   ```

5. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```
   python manage.py runserver 
   ```

## Usage

- Admin interface: http://localhost:8000/admin/
- API endpoints: http://localhost:8000/api/

### API Endpoints

- Lab members: `/api/members/`
- Projects: `/api/projects/`
- Collaborations: `/api/collaborations/`
- Grants: `/api/grants/`
- Awards: `/api/awards/`
- Publications: `/api/publications/`
- Partnerships: `/api/partnerships/`

## Media Files

Media files (images, videos, etc.) are stored in the `media/` directory and served at `/media/` URL path.

## Front-end Integration

This backend is designed to be used with a Next.js front-end (to be built separately).

## Deployment

For production deployment:

1. Set `DEBUG = False` in `settings.py`
2. Configure a proper database (PostgreSQL recommended)
3. Set specific `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`
4. Use a proper web server like Nginx with Gunicorn 