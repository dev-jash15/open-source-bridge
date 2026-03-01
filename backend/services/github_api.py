# GitHub fetching logic
import requests
import os
import json
import pandas as pd
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
CACHE_FILE = "data/github_cache.json"

class GitHubEngine:
    def __init__(self):
        self.headers = {
            "Authorization": f"token {GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json"
        }

    def fetch_issues(self, language="python"):
        # 1. Check Cache (Keep this part the same)
        if os.path.exists(CACHE_FILE):
            file_time = datetime.fromtimestamp(os.path.getmtime(CACHE_FILE))
            if datetime.now() - file_time < timedelta(hours=1):
                with open(CACHE_FILE, 'r') as f:
                    return json.load(f)

        # 2. The Fully Qualified Query
        # We need is:issue to satisfy the API, and is:public for safety
        api_query = f'is:issue is:public state:open label:"good first issue" language:{language}'
        
        url = "https://api.github.com/search/issues"
        params = {
            "q": api_query,
            "sort": "created",
            "order": "desc",
            "per_page": 20
        }
        
        response = requests.get(url, headers=self.headers, params=params)
        
        if response.status_code == 200:
            data = response.json().get("items", [])
            
            os.makedirs("data", exist_ok=True)
            with open(CACHE_FILE, 'w') as f:
                json.dump(data, f)
            return data
        else:
            # This is your safety net—always print the error body!
            print(f"GitHub API Error {response.status_code}: {response.text}")
            return []

    def get_repo_stats(self, repo_full_name):
        """Proof of Technical Execution: Fetching extra data for our 'Bridge Score'"""
        url = f"https://api.github.com/repos/{repo_full_name}"
        response = requests.get(url, headers=self.headers)
        return response.json() if response.status_code == 200 else {}