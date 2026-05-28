# AI Portfolio Generator

AI Portfolio Generator is an AI-powered web application for generating a professional portfolio with OpenAI.

The user enters short information about themselves, their experience, skills, projects, and contacts. The system sends this prompt to the backend, generates a structured portfolio, allows the user to save it, and export it as a PDF.

## Features

- AI portfolio generation
- Authorization and registration
- Portfolio saving
- PDF export
- Responsive design

## Technologies

### Frontend

- React
- Vite
- Tailwind CSS
- Supabase Auth

### Backend

- FastAPI
- OpenAI API

### Database

- Supabase PostgreSQL

### Deploy

- Vercel
- Render

## Project Structure

```text
frontend/
backend/
```

## Local Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Environment Variables

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

## Screenshots

### Authentication

Placeholder for authentication screen.

### AI Portfolio Generator

Placeholder for portfolio generator screen.

### PDF Export

Placeholder for exported PDF preview.

## Future Improvements

- Add more portfolio templates
- Add portfolio editing after generation
- Add multilingual portfolio generation
- Add server-side validation for generated portfolio data
