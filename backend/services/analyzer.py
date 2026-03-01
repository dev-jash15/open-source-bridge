# Pandas & Ranking algorithms
import pandas as pd
import numpy as np
from datetime import datetime

class BridgeAnalyzer:
    def __init__(self, issues_data):
        self.df = pd.DataFrame(issues_data)
        
    def calculate_scores(self):
        if self.df.empty:
            return []

        # Convert dates
        self.df['created_at'] = pd.to_datetime(self.df['created_at'])
        now = datetime.now(self.df['created_at'].dt.tz)
        self.df['days_old'] = (now - self.df['created_at']).dt.days

        # 1. Scoring Logic
        self.df['recency_score'] = np.exp(-self.df['days_old'] / 30)
        
        # Handle cases where all 'score' values might be zero or missing
        max_relevance = self.df['score'].max()
        self.df['relevance_score'] = self.df['score'] / max_relevance if max_relevance > 0 else 0
        
        self.df['friction_score'] = 1 / (self.df['comments'] + 1)

        # 2. Final Score
        self.df['bridge_score'] = (
            (self.df['recency_score'] * 0.5) + 
            (self.df['relevance_score'] * 0.3) + 
            (self.df['friction_score'] * 0.2)
        ) * 100
        
        # 1. Convert any Infinity to 100
        self.df = self.df.replace([np.inf, -np.inf], 100.0)
        # 2. Fill all NaNs (Not a Number) with 0.0
        self.df = self.df.fillna(0.0)
        # 3. Ensure everything is a native Python float for JSON compatibility
        self.df['bridge_score'] = self.df['bridge_score'].round(1).astype(float)
        # --------------------------

        return self.df.sort_values(by='bridge_score', ascending=False).to_dict('records')