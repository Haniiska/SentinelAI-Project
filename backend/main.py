from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import os
import re
import requests

load_dotenv()

VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def check_url_virustotal(url):
    try:
        headers = {
            "x-apikey": VIRUSTOTAL_API_KEY
        }

        response = requests.post(
            "https://www.virustotal.com/api/v3/urls",
            headers=headers,
            data={"url": url}
        )

        if response.status_code != 200:
            return None

        analysis_id = response.json()["data"]["id"]

        result = requests.get(
            f"https://www.virustotal.com/api/v3/analyses/{analysis_id}",
            headers=headers
        )

        if result.status_code != 200:
            return None

        stats = result.json()["data"]["attributes"]["stats"]

        return {
            "malicious": stats.get("malicious", 0),
            "suspicious": stats.get("suspicious", 0),
            "harmless": stats.get("harmless", 0)
        }

    except Exception:
        return None


class MessageRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {"message": "SentinelAI Backend Running"}


@app.post("/analyze")
def analyze_message(data: MessageRequest):
    try:

        # URL Detection
        urls = re.findall(
            r'https?://[^\s]+',
            data.message
        )

        url_warning = None
        vt_result = None

        if len(urls) > 0:
            url_warning = f"⚠ Suspicious URL Found: {urls[0]}"
            vt_result = check_url_virustotal(urls[0])

        # Email Detection
        emails = re.findall(
            r'[\w\.-]+@[\w\.-]+\.\w+',
            data.message
        )

        email_warning = None

        if len(emails) > 0:
            email_warning = f"📧 Email Detected: {emails[0]}"

        prompt = f"""
You are a cybersecurity expert.

Analyze the message.

IMPORTANT:
- Risk Score must be between 0 and 100.
- Obvious phishing attacks should be 80-100.
- Suspicious scams should be 60-80.
- Safe messages should be below 30.

Return ONLY in this exact format:

Risk Score: <number>

Threat Level: LOW/MEDIUM/HIGH

Threat Category: Phishing/Scam/Malware/Safe

Summary: <one short paragraph>

Message:
{data.message}
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=300
        )

        return {
            "success": True,
            "analysis": response.choices[0].message.content,
            "url_found": len(urls) > 0,
            "url_warning": url_warning,
            "email_found": len(emails) > 0,
            "email_warning": email_warning,
            "urls": urls,
            "emails": emails,
            "virustotal": vt_result
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }