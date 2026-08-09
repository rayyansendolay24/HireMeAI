import json
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel
from pypdf import PdfReader


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY is not configured."
    )

client = Groq(
    api_key=GROQ_API_KEY
)

MODEL = "openai/gpt-oss-120b"


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="HireMeAI API",
    description="AI-powered candidate recruitment API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        # Vercel deployment
        "https://hiremeai.vercel.app",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# MODELS
# ============================================================

class Experience(BaseModel):

    company: str | None = None

    role: str | None = None

    duration: str | None = None

    description: str | None = None

    skills_used: list[str] = []


class Resume(BaseModel):

    name: str | None = None

    email: str | None = None

    phone: str | None = None

    total_experience_years: float | None = None

    skills: list[str] = []

    experiences: list[Experience] = []

    education: list[str] = []

    projects: list[str] = []

    certifications: list[str] = []


class ChatRequest(BaseModel):

    question: str


class MatchRequest(BaseModel):

    job_description: str


resume_schema = Resume.model_json_schema()


# ============================================================
# PDF
# ============================================================

def read_pdf(file_path: Path):

    if not file_path.exists():

        raise FileNotFoundError(
            f"Resume PDF not found: {file_path}"
        )

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:

            text += page_text + "\n"

    return text


# ============================================================
# RESUME PARSER
# ============================================================

def parse_resume(resume_text: str):

    system_prompt = f"""

You are an expert resume parser.

Extract information from the resume based on meaning,
not only exact section headings.

Different resumes may use different headings.

Examples:

Experience
Professional Experience
Work History
Employment
Internships

These can all contain experience.

Skills can appear in:

- Skills
- Experience
- Internships
- Projects
- Certifications

Return ONLY valid JSON matching this schema:

{json.dumps(resume_schema, indent=2)}

Rules:

1. Do not invent information.

2. If a value is unavailable, return null.

3. If a list has no information, return [].

4. Include internships inside experiences.

5. Extract relevant skills from the entire resume.

"""


    user_prompt = f"""

Parse the following resume:

{resume_text}

"""


    response = client.chat.completions.create(

        model=MODEL,

        messages=[
            {
                "role": "system",
                "content": system_prompt
            },

            {
                "role": "user",
                "content": user_prompt
            }
        ],

        response_format={
            "type": "json_object"
        }
    )


    raw_output = response.choices[0].message.content

    data = json.loads(raw_output)

    return Resume(**data)


# ============================================================
# LOAD RESUME
# ============================================================

def get_resume():

    resume_path = BASE_DIR / "my_resume.pdf"

    resume_text = read_pdf(resume_path)

    return parse_resume(resume_text)


# ============================================================
# AI CANDIDATE CHAT
# ============================================================

def ask_candidate(
    question: str,
    resume: Resume
):

    system_prompt = f"""

You are HireMeAI.

You are an AI assistant representing a job candidate.

Candidate information:

{resume.model_dump_json(indent=2)}

Rules:

1. Answer ONLY using the candidate information.

2. Never hallucinate.

3. Never invent skills, jobs, education,
projects or experience.

4. If information is unavailable, say:

"I don't have enough information to answer that."

5. Be professional.

6. Answer as if HR is interviewing this candidate.

"""


    response = client.chat.completions.create(

        model=MODEL,

        messages=[
            {
                "role": "system",
                "content": system_prompt
            },

            {
                "role": "user",
                "content": question
            }
        ]
    )


    return response.choices[0].message.content


# ============================================================
# JOB MATCHING
# ============================================================

def match_candidate(
    job_description: str,
    resume: Resume
):

    system_prompt = f"""

You are an expert technical recruiter.

You must evaluate how well this candidate matches
the supplied job description.

Candidate:

{resume.model_dump_json(indent=2)}

Job Description:

{job_description}

Return ONLY valid JSON.

Use exactly this structure:

{{
    "match_score": 0,
    "summary": "",
    "matching_skills": [],
    "missing_skills": [],
    "matching_experience": [],
    "recommendation": ""
}}

Rules:

1. match_score must be between 0 and 100.

2. Do not invent candidate skills.

3. Only use information contained in the candidate resume.

4. Clearly identify missing skills.

5. Give a professional recruitment recommendation.

"""


    response = client.chat.completions.create(

        model=MODEL,

        messages=[
            {
                "role": "system",
                "content": system_prompt
            }
        ],

        response_format={
            "type": "json_object"
        }
    )


    return json.loads(
        response.choices[0].message.content
    )


# ============================================================
# ROUTES
# ============================================================

@app.get("/")
def home():

    return {
        "message": "HireMeAI API is running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "HireMeAI API"
    }


@app.get("/resume")
def resume_endpoint():

    try:

        resume = get_resume()

        return resume.model_dump()

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@app.post("/chat")
def chat(request: ChatRequest):

    try:

        resume = get_resume()

        answer = ask_candidate(
            request.question,
            resume
        )

        return {
            "answer": answer
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@app.post("/match")
def match(request: MatchRequest):

    try:

        if not request.job_description.strip():

            raise HTTPException(
                status_code=400,
                detail="Job description cannot be empty."
            )

        resume = get_resume()

        result = match_candidate(
            request.job_description,
            resume
        )

        return result

    except HTTPException:

        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )