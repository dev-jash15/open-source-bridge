# Gemini API integration
import os
from groq import Groq
from dotenv import load_dotenv
import json

load_dotenv()

class GroqAnalyzer:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"

    def analyze_issue(self, title, body):
        prompt = f"""
        You are an expert Open Source Mentor. Analyze this GitHub issue for a beginner:
        
        ISSUE TITLE: {title}
        ISSUE BODY: {body[:3000]}  # Truncate to save tokens

        Return a JSON object with exactly these keys:
        1. "summary": A 1-sentence TL;DR of what needs to be fixed.
        2. "technical_stack": The main tools/languages needed (e.g., "Python, Pandas").
        3. "first_step": The specific file or logic area to investigate first.
        4. "comment_draft": A professional, polite comment for the user to post on the issue.
        """

        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a technical assistant that only outputs valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            return json.loads(completion.choices[0].message.content)
        except Exception as e:
            print(f"Groq API Error: {e}")
            return {
                "summary": "Error analyzing issue.",
                "technical_stack": "Unknown",
                "first_step": "Check the main repository README.",
                "comment_draft": "Hi! I'm interested in helping with this issue."
            }