# Gemini API integration
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_issue_with_groq(issue_body, issue_title):
    prompt = f"""
    You are an expert Open Source Mentor. Analyze this GitHub issue:
    Title: {issue_title}
    Body: {issue_body[:2000]} 

    Provide a JSON response with:
    1. "summary": A one-sentence TL;DR for a beginner.
    2. "difficulty": A score from 1-10.
    3. "first_step": The very first file or function the dev should look at.
    4. "comment_draft": A polite, professional comment to post on the issue.
    """

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "You output valid JSON only."},
            {"role": "user", "content": prompt}
        ],
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"}
    )
    return chat_completion.choices[0].message.content