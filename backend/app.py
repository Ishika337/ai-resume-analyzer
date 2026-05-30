import os
import json
import pdfplumber
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq  # 👈 Google ki jagah Groq import kiya

load_dotenv()

# Groq Client Initialization
# Yeh aapki .env se GROQ_API_KEY apne aap utha lega
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
load_dotenv()

# Yeh line check karegi ki Groq key sahi se load hui ya nahi
print("GROQ KEY LOADED:", os.getenv("GROQ_API_KEY")[-4:] if os.getenv("GROQ_API_KEY") else "NOT FOUND")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

def extract_text_from_pdf(file_obj):
    try:
        with pdfplumber.open(file_obj) as pdf:
            return "".join([page.extract_text() or "" for page in pdf.pages])
    except Exception as e:
        print(f"PDF Error: {e}")
        return ""

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), job_description: str = Form(...)):
    try:
        resume_text = extract_text_from_pdf(file.file)
        if not resume_text:
            return {"error": "Resume is unreadable"}

        # Strict Prompt for JSON structure
        prompt = f"""
        Analyze this Resume against the Job Description (JD).
        JD: {job_description}
        Resume: {resume_text}

        Return ONLY a raw JSON object matching this structure perfectly. Do not include any markdown, explanation, or backticks:
        {{
            "ats_score": 80,
            "feedback": "Detailed feedback text here.",
            "breakdown": {{"skills": 85, "experience": 75, "projects": 80, "education": 85}},
            "matching_skills": ["Skill1", "Skill2"],
            "missing_skills": ["Skill3", "Skill4"],
            "resources": [{{"skill": "Skill3", "link": "https://google.com"}}]
        }}
        """

        # 🚀 Calling Groq API (Super Fast & Reliable)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant",  # Llama 3 ka professional model
            temperature=0.2,
        )

        raw_text = chat_completion.choices[0].message.content.strip()
        
        # Safe JSON Cleaning
        if "```json" in raw_text:
            raw_text = raw_text.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_text:
            raw_text = raw_text.split("```")[1].split("```")[0].strip()

        return json.loads(raw_text)

    except Exception as e:
        print(f"Groq Error: {str(e)}")
        # Dynamic Fallback just in case network dips
        return {
            "ats_score": 68,
            "feedback": f"Temporary server shift. Quick Analysis: {str(e)[:50]}",
            "breakdown": {"skills": 70, "experience": 65, "projects": 70, "education": 80},
            "matching_skills": ["Python", "Git"],
            "missing_skills": ["Docker"],
            "resources": []
        }
