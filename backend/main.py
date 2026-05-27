from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


@app.get("/")
def home():
    return {"message": "AI Portfolio Generator API"}


@app.get("/generate")
def generate_portfolio(prompt: str):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": """
Ты AI агент для генерации профессионального портфолио.

Всегда возвращай ТОЛЬКО валидный JSON.

Обязательно:
- заполняй ВСЕ поля,
- всегда генерируй skills,
- всегда генерируй хотя бы 1 project,
- если контактов нет — оставляй пустую строку.

Структура:

{
  "name": "",
  "profession": "",
  "bio": "",
  "skills": [],
  "projects": [
    {
      "title": "",
      "description": ""
    }
  ],
  "contacts": {
    "email": "",
    "github": ""
  },
  "theme": ""
}
                """
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = response.choices[0].message.content

    return json.loads(content)
