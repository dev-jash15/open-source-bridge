# API Entry point
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.github_api import GitHubEngine
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
    issues = engine.fetch_issues(language=lang)
    # Return basic data for the cards
    return {"count": len(issues), "issues": issues}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)