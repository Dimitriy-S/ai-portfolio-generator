# Architecture

AI Portfolio Generator is built as a full-stack web application with a React frontend, FastAPI backend, Supabase database, and OpenAI integration.

## Overview

```text
[ React Frontend ]
        |
        v
[ FastAPI Backend ] ---> [ OpenAI API ]
        |
        v
[ Supabase Database ]
```

## Frontend

The frontend is located in `frontend/` and is built with React, Vite, and Tailwind CSS.

Main responsibilities:

- Render authentication screens
- Render the AI portfolio generator interface
- Send portfolio prompts to the backend
- Display generated portfolio previews
- Save generated portfolios to Supabase
- Show saved portfolios for the current user
- Export portfolios to PDF on the client

## Backend

The backend is located in `backend/` and is built with FastAPI.

Main responsibilities:

- Expose the `/generate` endpoint
- Receive the user prompt from the frontend
- Send the prompt to the OpenAI API
- Return structured JSON portfolio data to the frontend

## Database

Supabase PostgreSQL stores user portfolio records.

The `portfolios` table stores:

- `user_id` for ownership
- `title` for display in the saved portfolio list
- `data` as the full generated portfolio object
- `created_at` for ordering and display

## AI Integration

The AI generation flow uses the OpenAI API through the FastAPI backend.

Flow:

1. User enters a prompt in the React app.
2. React sends the prompt to the FastAPI `/generate` endpoint.
3. FastAPI sends the prompt to OpenAI with a system prompt that requests valid JSON.
4. OpenAI returns structured portfolio data.
5. FastAPI returns the parsed JSON to the frontend.
6. React renders the generated portfolio preview.

## Authentication Flow

Authentication is handled by Supabase Auth on the frontend.

Flow:

1. User registers or logs in through the React auth screen.
2. Supabase creates and persists the session.
3. React checks the active session with `supabase.auth.getSession()`.
4. If a session exists, the generator UI is shown.
5. If no session exists, the auth screen is shown.
6. Saved portfolios are queried using the current user's `user.id`.

## PDF Export System

PDF export is handled fully on the client with `html2pdf.js`.

Flow:

1. React renders a separate simple PDF template.
2. The template uses a DOM `ref`.
3. The user clicks `Download PDF`.
4. `html2pdf.js` receives `pdfRef.current`.
5. The portfolio is downloaded as `portfolio.pdf`.

The PDF template is intentionally separate from the main UI so the exported document has a clean resume-like layout with a white background, dark text, readable spacing, and minimal styling.
