import os
import requests
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


def generate_review(notes: str):
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "openai/gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a movie review assistant.",
                    },
                    {
                        "role": "user",
                        "content": f"""
Generate a short engaging movie review based on these user notes:

{notes}

Keep it under 80 words.
""",
                    },
                ],
            },
        )

        data = response.json()

        print(data)

        return data["choices"][0]["message"]["content"]

    except Exception as e:
        print("AI ERROR:", e)
        return "Could not generate review."