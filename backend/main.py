from typing import Any
import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel

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


class ImproveRequest(BaseModel):
    portfolio: dict[str, Any]
    style: str = "Minimal"


PORTFOLIO_JSON_STRUCTURE = """
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
    "github": "",
    "phone": ""
  },
  "theme": ""
}
"""


def parse_json_response(content: str):
    cleaned = content.strip()

    if cleaned.startswith("```json"):
        cleaned = cleaned.removeprefix("```json").strip()
    elif cleaned.startswith("```"):
        cleaned = cleaned.removeprefix("```").strip()

    if cleaned.endswith("```"):
        cleaned = cleaned.removesuffix("```").strip()

    return json.loads(cleaned)


@app.get("/")
def home():
    return {"message": "AI Portfolio Generator API"}


@app.get("/generate")
def generate_portfolio(prompt: str, style: str = "Minimal"):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": f"""
Ты AI агент для генерации профессионального портфолио.

Всегда возвращай ТОЛЬКО валидный JSON.

Выбранный стиль портфолио: {style}.
Учитывай этот стиль при генерации bio, skills, projects и theme.

Обязательно:
- заполняй ВСЕ поля,
- всегда генерируй skills,
- всегда генерируй хотя бы 1 project,
- всегда возвращай contacts.email, contacts.github и contacts.phone,
- если контактов нет — оставляй пустую строку.

Структура:

{PORTFOLIO_JSON_STRUCTURE}
                """
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = response.choices[0].message.content

    return parse_json_response(content)


@app.post("/improve")
def improve_portfolio(request: ImproveRequest):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": f"""
Ты AI редактор профессиональных портфолио.

Всегда возвращай ТОЛЬКО валидный JSON.

Выбранный стиль портфолио: {request.style}.

Улучши существующее портфолио:
- сделай bio более профессиональным и убедительным,
- улучши profession title,
- улучши descriptions у projects,
- сохрани общий профессиональный тон,
- НЕ удаляй contacts,
- НЕ удаляй contacts.phone,
- НЕ теряй skills,
- НЕ меняй структуру JSON.

Структура должна остаться:

{PORTFOLIO_JSON_STRUCTURE}
                """
            },
            {
                "role": "user",
                "content": json.dumps(request.portfolio, ensure_ascii=False)
            }
        ]
    )

    content = response.choices[0].message.content

    return parse_json_response(content)
