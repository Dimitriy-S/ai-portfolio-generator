AI Portfolio Generator

React + FastAPI проект для генерации портфолио с AI агентом.

Структура:
- `frontend` - React, Vite, Tailwind CSS, Supabase Auth
- `backend` - FastAPI API для генерации портфолио через OpenAI

Запуск frontend:

```bash
cd frontend
npm install
npm run dev
```

Запуск backend:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

В `backend/.env` нужно добавить реальный OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Supabase publishable key находится во frontend-коде и используется только для клиентской авторизации.
