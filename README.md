# 🌉 The Open Source Bridge
**"Bridging the Gap Between Code and Career."**

## 💡 Main Motivation
Early-career developers, including **Master of Science in Computer Science** graduates and professional **Data Analysts**, often face "contribution paralysis". While they possess the technical skills, finding a welcoming, relevant, and "active" project in the vast sea of GitHub is a complex data problem.

**The Open Source Bridge** was built to solve this. It is a discovery engine that uses **Data Science** to rank opportunities and **Groq AI** to provide an instant roadmap for the first pull request. It is designed specifically for developers looking to transform academic knowledge into industry-ready portfolio contributions.

---

## 🏗️ System Architecture
The project utilizes a decoupled "Power Stack" to ensure speed, data integrity, and a premium user experience.



* **Frontend**: Next.js 14, React, and Tailwind CSS for a high-performance "glassmorphism" dashboard.
* **Backend**: FastAPI (Python) providing an asynchronous bridge between data and AI.
* **Data Engine**: Python & Pandas for real-time dataset transformation and ranking.
* **AI Layer**: Groq LPU (Llama 3.3 70B) for lightning-fast issue synthesis and contributor guidance.
* **External API**: GitHub REST API for real-time repository metadata.

---

## 🚀 Key Features

### 1. Language-Agnostic Search Engine
Unlike static "good first issue" lists, this engine supports any programming language GitHub recognizes. It dynamically constructs search queries to find open, public issues specifically tagged for beginners.

### 2. Isolated Language Caching
To optimize performance and respect API rate limits, the backend implements a dynamic caching strategy:
* **Mechanism**: Every search query generates a language-specific `.json` cache (e.g., `cache_python.json`, `cache_rust.json`).
* **Benefit**: Prevents cross-language data contamination and allows for sub-second reloads for previously searched stacks.

### 3. The "Bridge Score" (Proprietary Ranking)
Utilizing **Pandas**, we calculate a weighted score from **0–100** to identify the "Sweet Spot" for contributors:
* **Recency (50%)**: Uses exponential decay to prioritize issues that are still fresh.
* **Popularity (30%)**: Weighted by repository stars to ensure high-quality codebase exposure.
* **Friction (20%)**: Inversely proportional to comment count; fewer comments indicate an unclaimed issue.

$$Bridge Score = (Recency \times 0.5) + (Relevance \times 0.3) + (Friction \times 0.2)$$

### 4. Groq AI Contributor Guide
When a user clicks **"Analyze"**, the **Groq LPU** parses the issue's context to provide:
* **TL;DR Summary**: A one-sentence distillation of the problem.
* **Technical Stack**: Precisely what tools/languages are needed.
* **First Step**: A specific file or function to investigate first, reducing entry friction.
* **Outreach Draft**: A professional, polite comment draft the user can use to claim the issue.

### 5. Premium "Portfolio Builder" UI
* **Glassmorphism Cards**: Clean visual hierarchy with high-contrast "Bridge Score" badges.
* **No-Scrollbar UI**: Custom CSS for a seamless, "app-like" feel while maintaining scrollability.
* **Direct Redirect**: The **"Got it, I'm on it!"** button opens the specific GitHub issue in a new tab for immediate action.



---

## 🧪 Technical Execution
* **Data Validation**: Implemented robust sanitization in **Pandas** to handle `NaN` and `Infinity` values, ensuring JSON compliance for the frontend.
* **Hook Optimization**: Used React `useCallback` to stabilize API functions and prevent redundant re-renders.
* **CORS Configuration**: Secured the communication tunnel between the FastAPI backend (`localhost:8000`) and the Next.js frontend (`localhost:3000`).

---

## 🛠️ Installation & Setup

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. Create a `.env` file with your `GROQ_API_KEY`.
4. `python main.py`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---
