# SASEL Lab Website - Frontend

This is the frontend application for the SASEL Lab website. It's built with Next.js 15 and communicates with a Django backend API.

## Features

- Modern UI built with Next.js 15 (App Router) and Tailwind CSS
- TypeScript for type safety
- API integration with Django backend
- Responsive design for all devices
- Sections for lab members, projects, publications, and more

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn package manager
- Backend API running (Django)

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Adjust the URL if your backend runs on a different port or host.

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Building for Production

Build the application for production:

```bash
npm run build
# or
yarn build
```

You can then start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable React components
- `src/lib/api/` - API client and services for backend communication
- `public/` - Static files like images and icons

## Backend API Integration

The frontend connects to the Django backend API at the URL specified in the `.env.local` file. The API services are defined in `src/lib/api/services.ts` and use Axios for HTTP requests.

The available API endpoints include:
- `/api/members/` - Lab members
- `/api/projects/` - Research projects
- `/api/publications/` - Academic publications
- `/api/grants/` - Research grants
- `/api/awards/` - Awards
- `/api/collaborations/` - Collaborations
- `/api/partnerships/` - Partnerships

## Contributing

1. Create a feature branch (`git checkout -b feature/your-feature`)
2. Commit your changes (`git commit -m 'Add some feature'`)
3. Push to the branch (`git push origin feature/your-feature`)
4. Open a Pull Request
