"use client";
import { useState, useEffect, useCallback } from "react";

export default function Home() {
  const [language, setLanguage] = useState("python");
  const [activeQuery, setActiveQuery] = useState("python");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const fetchIssues = useCallback(async (lang: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/recommendations?lang=${lang.toLowerCase()}`,
      );
      const data = await res.json();
      setIssues(data.issues || []);
      setActiveQuery(lang);
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues("python");
  }, [fetchIssues]);

  const handleAnalyze = async (issue: any) => {
    setSelectedIssue(issue);
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch(
        `http://localhost:8000/api/analyze?title=${encodeURIComponent(issue.title)}&body=${encodeURIComponent(issue.body || "")}`,
      );
      const data = await res.json();
      setAiResult(data);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const redirectToGithub = () => {
    if (selectedIssue?.html_url) {
      window.open(selectedIssue.html_url, "_blank");
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 pb-20 relative overflow-x-hidden no-scrollbar">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -z-10" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Mission Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black mb-6 tracking-widest uppercase">
          Portfolio Builder Engine
        </div>

        {/* Main Title */}
        <h1 className="text-6xl font-black text-white mb-6 tracking-tighter leading-none">
          The Open Source{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Bridge.
          </span>
        </h1>

        {/* NEW: Mission Tagline */}
        <p className="text-xl text-slate-400 max-w-2xl leading-relaxed font-medium">
          Transform your career by contributing to meaningful projects. Discover
          AI-ranked issues tailored to your technical stack.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchIssues(language);
          }}
          className="flex gap-4 p-1.5 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl max-w-xl"
        >
          <input
            type="text"
            className="flex-grow bg-transparent p-3 outline-none text-white placeholder:text-slate-600 font-semibold text-sm"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Search language..."
          />
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95">
            Find Issues
          </button>
        </form>
      </div>

      {/* Grid - Cards with constrained heights */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue: any) => (
            <div
              key={issue.id}
              className="group relative bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all duration-500 flex flex-col hover:-translate-y-1"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="px-3 py-1 rounded-full text-[9px] font-black bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-widest">
                  Score: {issue.bridge_score}
                </span>
                <span className="text-slate-600 text-[9px] font-black">
                  #{issue.number}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-400">
                {issue.title}
              </h2>
              <p className="text-slate-500 text-[11px] font-bold mb-8">
                {issue.comments} comments
              </p>

              {/* Button size reduced from py-5 to py-3 */}
              <button
                onClick={() => handleAnalyze(issue)}
                className="w-full bg-white/5 hover:bg-blue-600 hover:text-white text-slate-300 font-bold py-3 rounded-xl border border-white/10 text-sm transition-all"
              >
                Analyze with Groq
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL - Fixed Scroll and Overflow */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-hidden">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-xl rounded-[2rem] p-8 shadow-2xl relative flex flex-col max-h-[85vh]">
            <button
              onClick={() => setSelectedIssue(null)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-2xl font-black text-white mb-6 tracking-tighter">
              Contributor Guide
            </h3>

            {/* Content area with Hidden Scrollbar */}
            <div className="flex-grow overflow-y-auto no-scrollbar space-y-8 pr-2">
              {aiLoading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.2em]">
                    Processing...
                  </p>
                </div>
              ) : aiResult ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                      The Mission
                    </label>
                    <p className="text-base text-slate-100 font-semibold leading-relaxed">
                      {aiResult.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">
                        Tech Stack
                      </label>
                      {/* Added break-words to prevent overflow */}
                      <p className="text-white font-bold text-xs break-words">
                        {aiResult.technical_stack}
                      </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">
                        Quick Start
                      </label>
                      {/* Added break-all for long file paths */}
                      <p className="text-white font-bold text-xs break-all leading-tight">
                        {aiResult.first_step}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      Drafted Outreach
                    </label>
                    <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/5 font-mono text-[13px] text-blue-300 leading-relaxed overflow-x-hidden">
                      {aiResult.comment_draft}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Fixed Button at the bottom of modal */}
            <button
              onClick={redirectToGithub}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shadow-xl shadow-blue-900/20"
            >
              {`Got it, I'm on it! →`}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
