# API Entry point
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.github_api import GitHubEngine
from services.analyzer import BridgeAnalyzer
from services.ai_agent import GroqAnalyzer # Ensure this is correct
import os


app = FastAPI()
engine = GitHubEngine()
ai_engine = GroqAnalyzer()

# Allow Next.js to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development; narrow this down for production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/recommendations")
# 'lang' is now a dynamic string from the frontend, defaulting to "python"
async def get_recommendations(lang: str = "python"): 
    raw_issues = engine.fetch_issues(language=lang)

    if not raw_issues:
        return {"count": 0, "issues": []}
    
    analyzer = BridgeAnalyzer(raw_issues)
    ranked_issues = analyzer.calculate_scores()
    return {"count": len(ranked_issues), "issues": ranked_issues}

# Returns AI-Generated Insights for a given issue
@app.get("/api/analyze")
async def analyze_issue(title: str, body: str):
    return ai_engine.analyze_issue(title, body)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)