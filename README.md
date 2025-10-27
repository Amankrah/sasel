# SASEL Lab Website

> **Sustainable Agri-food Systems and Environment Lab**  
> McGill University

A modern, full-stack web application for managing and showcasing research activities, publications, team members, and collaborations of the SASEL Lab at McGill University.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Overview

The SASEL Lab website is a comprehensive platform designed to:
- Showcase ongoing and past research projects
- Highlight lab members and their contributions
- Display publications, grants, and awards
- Manage collaborations and partnerships
- Provide an easy-to-use content management system for lab administrators

## 🏗️ Technology Stack

### Backend
- **Framework**: Django 5.1.6
- **API**: Django REST Framework 3.15.0
- **Database**: SQLite (development), PostgreSQL-ready for production
- **Media Handling**: Pillow 11.2.1
- **CORS**: django-cors-headers 4.3.1
- **Static Files**: WhiteNoise 6.6.0

### Frontend
- **Framework**: Next.js 15.2.4 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: React 19
- **HTTP Client**: Axios 1.8.4
- **Icons**: React Icons 5.5.0

## 📁 Project Structure

```
sasel_lab/
├── backend/                    # Django backend application
│   ├── lab_content/           # Main Django app for content management
│   │   ├── models.py          # Database models
│   │   ├── serializers.py     # API serializers
│   │   ├── views.py           # API views
│   │   └── urls.py            # API endpoints
│   ├── sasel_lab_site/        # Django project settings
│   ├── data_import.py         # CSV data import script
│   ├── manage.py              # Django management script
│   └── requirements.txt       # Python dependencies
│
├── frontend/                   # Next.js frontend application
│   ├── src/
│   │   ├── app/               # Next.js pages (App Router)
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── members/       # Lab members page
│   │   │   ├── projects/      # Projects page
│   │   │   └── publications/  # Publications page
│   │   ├── components/        # Reusable React components
│   │   │   ├── Navbar.tsx     # Navigation bar
│   │   │   └── Footer.tsx     # Footer component
│   │   └── lib/api/           # API client and services
│   ├── public/                # Static assets
│   └── package.json           # Node dependencies
│
└── data_templates/             # CSV templates for data import (gitignored)
    ├── lab_members.csv
    ├── projects.csv
    ├── publications.csv
    ├── grants.csv
    ├── awards.csv
    ├── collaborations.csv
    └── partnerships.csv
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18.17.0+**
- **npm** or **yarn**
- **Git**

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser** (for admin access):
   ```bash
   python manage.py createsuperuser
   ```

6. **Start the development server**:
   ```bash
   python manage.py runserver
   ```

   The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create environment file**:
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The frontend will be available at `http://localhost:3000`

## 📊 Features

### Content Management
- **Lab Members**: Manage profiles of professors, research assistants, students, and alumni
- **Research Projects**: Showcase current and past research initiatives
- **Publications**: Display academic papers, articles, and research outputs
- **Grants**: Track research funding and grant information
- **Awards**: Highlight achievements and recognitions
- **Collaborations**: Manage partnerships with other institutions
- **Partnerships**: Industry and academic partnerships

### API Endpoints

All API endpoints are available at `http://localhost:8000/api/`:

| Endpoint | Description |
|----------|-------------|
| `/api/members/` | Lab members list and details |
| `/api/projects/` | Research projects |
| `/api/publications/` | Academic publications |
| `/api/grants/` | Research grants |
| `/api/awards/` | Awards and recognitions |
| `/api/collaborations/` | Institutional collaborations |
| `/api/partnerships/` | Industry/academic partnerships |

### Admin Interface

Access the Django admin panel at `http://localhost:8000/admin/` to manage all content through a user-friendly interface.

## 📝 Data Import

The project includes a data import script for bulk loading content from CSV templates:

```bash
cd backend
python data_import.py
```

**Note**: CSV templates are located in the `data_templates/` directory (gitignored for data privacy).

## 🎨 Frontend Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Type-Safe**: Full TypeScript implementation
- **Image Carousel**: Dynamic content showcase on the homepage
- **Partner Logos**: Automated partner logo display
- **Smooth Navigation**: Intuitive menu and routing

## 🔧 Development

### Backend Development

- **Run migrations**: `python manage.py migrate`
- **Create migrations**: `python manage.py makemigrations`
- **Run tests**: `python manage.py test`
- **Access shell**: `python manage.py shell`

### Frontend Development

- **Development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Start production server**: `npm run start`
- **Lint code**: `npm run lint`

## 🚢 Deployment

### Backend Deployment

1. Set `DEBUG = False` in `settings.py`
2. Configure environment variables:
   - `SECRET_KEY`: Django secret key
   - `DATABASE_URL`: Production database URL
   - `ALLOWED_HOSTS`: Allowed domain names
   - `CORS_ALLOWED_ORIGINS`: Frontend domain
3. Use PostgreSQL for production database
4. Set up Gunicorn + Nginx for serving
5. Configure static file serving

### Frontend Deployment

1. Set production API URL in environment variables
2. Build the application: `npm run build`
3. Deploy to Vercel, Netlify, or custom server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

**SASEL Lab** - Sustainable Agri-food Systems and Environment Lab  
McGill University

## 📧 Contact

For questions or support, please contact the SASEL Lab at McGill University.

---

**Built with ❤️ for sustainable agriculture research**

