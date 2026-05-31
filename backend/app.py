import os
import json
import pdfplumber
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

app = FastAPI(title="AI Career Platform Backend - Live Grading Build")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InterviewRequest(BaseModel):
    skills: List[str]
    difficulty: str

class VoiceEvaluationRequest(BaseModel):
    question: str
    user_answer: str

class SummaryRequest(BaseModel):
    history: List[dict]

def extract_text_from_pdf(file_obj):
    try:
        with pdfplumber.open(file_obj) as pdf:
            return "".join([page.extract_text() or "" for page in pdf.pages])
    except Exception:
        return ""

def safe_parse_json(raw_text):
    try:
        start_idx = raw_text.find("{")
        end_idx = raw_text.rfind("}")
        if start_idx != -1 and end_idx != -1:
            return json.loads(raw_text[start_idx:end_idx + 1])
        return json.loads(raw_text)
    except Exception:
        return None

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), job_description: str = Form(...)):
    try:
        resume_text = extract_text_from_pdf(file.file)
        if not resume_text.strip():
            return {"error": "Empty Resume"}

        prompt = f"""
        Analyze this Resume against the Job Description (JD).
        JD: {job_description}
        Resume: {resume_text}

        Return ONLY a raw JSON object matching this schema exactly:
        {{
            "ats_score": 80,
            "feedback": "Quick developer summary of what is good and what is missing in simple words.",
            "breakdown": {{"skills": 85, "experience": 75, "projects": 80, "education": 95}},
            "matching_skills": ["Skill1", "Skill2"],
            "missing_skills": ["Skill3", "Skill4"],
            "resources": [
                {{"skill": "Skill3", "recommendation": "Learn how hooks handle state updates with small sample projects.", "link": "https://react.dev"}}
            ]
        }}
        """

        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=0.3,
        )

        response_data = safe_parse_json(chat_completion.choices[0].message.content.strip())
        if response_data:
            return response_data
        raise Exception()

    except Exception:
        return {
            "ats_score": 60,
            "feedback": "Analysis failed to format properly. Please try re-uploading clean plain text.",
            "breakdown": {"skills": 50, "experience": 50, "projects": 50, "education": 50},
            "matching_skills": [],
            "missing_skills": ["Data processing layers"],
            "resources": [{"skill": "System Core", "recommendation": "Review text payload formatting profiles.", "link": "https://google.com"}]
        }

@app.post("/generate-interview")
async def generate_interview(data: InterviewRequest):
    try:
        skills_str = ", ".join(data.skills)
        prompt = f"""
        Generate exactly 5 specific structural technical interview questions for these target frameworks: {skills_str}. 
        Difficulty Tier: {data.difficulty}.
        Return ONLY a JSON object format:
        {{"questions": ["Q1", "Q2", "Q3", "Q4", "Q5"]}}
        """
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=0.5,
        )
        parsed = safe_parse_json(chat_completion.choices[0].message.content.strip())
        if parsed and "questions" in parsed:
            return parsed
        raise Exception()
    except Exception:
        return {"questions": [
            f"Explain the core runtime lifecycle of {data.skills[0] if data.skills else 'your technology stack'}.",
            "How do you optimize data access and state components in a high-scale environment?",
            "Describe how you debug a production bottleneck or memory leak issue.",
            "What is the difference between synchronous and asynchronous execution in execution layers?",
            "Explain how standard data structures or indexing works in backend storage engines."
        ]}

@app.post("/evaluate-answer")
async def evaluate_answer(data: VoiceEvaluationRequest):
    try:
        cleaned_answer = data.user_answer.strip().lower().replace('"', '').replace("'", "")
        
        # 🚨 Dynamic Shortcut: Short or blank inputs immediately get graded on-the-spot as zero
        if not cleaned_answer or cleaned_answer in ["i dont know", "dont know", "no idea", "skip", "i do not know", "next", "pass"]:
            return {
                "score": 0,
                "strengths": "No valid logic attempted.",
                "weaknesses": "User passed on the question or stated lack of awareness.",
                "improvement": "Review fundamental concepts of this domain.",
                "confidence": 0
            }

        words_count = len(data.user_answer.split())

        prompt = f"""
        You are a highly precise automated Technical Interview Evaluator. 
        Evaluate the following user response strictly based on its semantic meaning, accurate keywords, and logical completeness. There is NO fixed standard answer—evaluate whatever technical explanation they provide on its own merits.

        Question: {data.question}
        User Answer: {data.user_answer}

        CRITICAL ASSESSMENT RULES:
        1. If the user answer is purely random text, gibberish, or has absolutely no relevance to the question's core subject, award a score of 0 or 1.
        2. Keep comments tailored strictly to the subject of the question. Do not inject irrelevant tech stacks or frameworks.

        Return ONLY a raw JSON object string with no markdown markdown blocks:
        {{
            "score": 7,
            "strengths": "Point out the exact correct technical points the user mentioned.",
            "weaknesses": "Point out what specific corner cases, details, or depth they missed.",
            "improvement": "Suggest exactly what to study to bridge this specific gap."
        }}
        """

        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=0.1,
        )

        raw_content = chat_completion.choices[0].message.content.strip()
        ai_response = safe_parse_json(raw_content)
        
        if ai_response and "score" in ai_response:
            base_confidence = 50
            if words_count > 15: base_confidence += 15
            if words_count > 45: base_confidence += 20
            
            confidence_score = min(int(base_confidence + (ai_response["score"] * 1.5)), 100)
            ai_response["confidence"] = confidence_score
            return ai_response
            
        raise Exception()

    except Exception:
        # Dynamic fallback that references the active content instead of generic hardcoded data
        words_count = len(data.user_answer.split())
        calculated_score = 3 if words_count > 12 else 1
        return {
            "score": calculated_score,
            "strengths": f"Attempt tracked with a response length of {words_count} words.",
            "weaknesses": "The answer did not provide clear industry standard keywords or structure.",
            "improvement": "Focus on clearly stating definition parameters, structure, and system constraints.",
            "confidence": 40
        }

@app.post("/interview-summary")
async def interview_summary(data: SummaryRequest):
    try:
        summary_payload = json.dumps(data.history)
        prompt = f"""
        Analyze this technical interview history: {summary_payload}
        Provide a concise 2-3 line overview summarizing the developer's overall capability, performance curve, and top core domain strengths.
        Return ONLY a clean JSON schema:
        {{"overall_feedback": "Summary description text here."}}
        """
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=0.3,
        )
        parsed = safe_parse_json(chat_completion.choices[0].message.content.strip())
        if parsed and "overall_feedback" in parsed:
            return parsed
        raise Exception()
    except Exception:
        return {"overall_feedback": "Session evaluation logged. Candidate's core metrics are visualized down below."}