# Pandas & Ranking algorithms
import pandas as pd
from datetime import datetime
import numpy as np

class BridgeAnalyzer:
    def __init__(self, issues_data):
        self.df = pd.DataFrame(issues_data)
        
    def calculate_scores(self):
        if self.df.empty:
            return []

        # 1. Convert dates to 'days old'
        self.df['created_at'] = pd.to_datetime(self.df['created_at'])
        now = datetime.now(self.df['created_at'].dt.tz)
        self.df['days_old'] = (now - self.df['created_at']).dt.days

        # 2. Normalize Recency (0 to 1, where 1 is brand new)
        # Using an exponential decay so very old issues drop off quickly
        self.df['recency_score'] = np.exp(-self.df['days_old'] / 30)

        # 3. Social Proof (Proxy for repo quality)
        # Note: If 'score' isn't in search results, we use GitHub's search relevance
        self.df['relevance_score'] = self.df['score'] / self.df['score'].max()

        # 4. Friction (Fewer comments = Higher score)
        self.df['friction_score'] = 1 / (self.df['comments'] + 1)

        # 5. Final Weighted Bridge Score (Scale 0-100)
        self.df['bridge_score'] = (
            (self.df['recency_score'] * 0.5) + 
            (self.df['relevance_score'] * 0.3) + 
            (self.df['friction_score'] * 0.2)
        ) * 100
        # Handle edge cases for bridge_score
        # 1. Replace Infinity with 100 (The best possible score)
        self.df['bridge_score'] = self.df['bridge_score'].replace([np.inf, -np.inf], 100.0)
        
        # 2. Replace NaN with 0.0 (The lowest possible score/Missing data)
        self.df['bridge_score'] = self.df['bridge_score'].fillna(0.0)
        
        # 3. Clip values to ensure they stay between 0 and 100
        self.df['bridge_score'] = self.df['bridge_score'].clip(0, 100)
        # ------------------------------------

        # Round for clean UI
        self.df['bridge_score'] = self.df['bridge_score'].round(1)

        # Sort by score and return as list of dicts
        return self.df.sort_values(by='bridge_score', ascending=False).to_dict('records')