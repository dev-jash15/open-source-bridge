# API Entry point
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.github_api import GitHubEngine
from services.analyzer import BridgeAnalyzer # Add this import
import json

app = FastAPI()
engine = GitHubEngine()

# Allow Next.js to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development; narrow this down for production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/recommendations")
async def get_recommendations(lang: str = "python"):
    raw_issues = engine.fetch_issues(language=lang)

    if not raw_issues:
        return {"count": 0, "issues": []}
    
    analyzer = BridgeAnalyzer(raw_issues)
    ranked_issues = analyzer.calculate_scores()
    return {"count": len(ranked_issues), "issues": ranked_issues}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)