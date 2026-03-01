"use client";
import { useState, useEffect, useCallback } from "react";

export default function Home() {
  // 1. Unified State - No Duplicates
  const [language, setLanguage] = useState("python");
  const [activeQuery, setActiveQuery] = useState("python");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. Stabilized Fetch Function
  const fetchIssues = useCallback(async (lang: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/recommendations?lang=${lang.toLowerCase()}`,
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setIssues(data.issues || []);
      setActiveQuery(lang);
    } catch (error) {
      console.error("Failed to fetch issues:", error);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Initial Load Only
  useEffect(() => {
    fetchIssues("python");
  }, [fetchIssues]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (language.trim()) {
      fetchIssues(language);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-5xl font-extrabold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          The Open Source Bridge
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
          Welcome back, Jash. Ready to contribute to the next big project?
        </p>
      </div>

      {/* Search & Verification Section */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Search language (e.g. Rust, Go, TypeScript)..."
            className="w-full bg-slate-800/50 border border-slate-700 p-4 pl-5 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-white transition-all"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          >
            {loading ? "Searching..." : "Find Issues"}
          </button>
        </form>

        <p className="text-sm text-slate-500 font-medium">
          Showing results for:{" "}
          <span className="text-blue-400 capitalize">{activeQuery}</span>
        </p>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="flex justify-center py-20 animate-pulse text-blue-400 font-bold text-lg">
            Fetching {language} data...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {issues.length > 0 ? (
              issues.map((issue: any) => (
                <div
                  key={issue.id}
                  className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 uppercase tracking-wider">
                      Bridge Score: {issue.bridge_score}
                    </span>
                    <span className="text-slate-500 text-xs font-mono">
                      #{issue.number}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-snug">
                    {issue.title}
                  </h2>

                  <div className="flex items-center gap-4 text-slate-400 text-sm mb-8">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                      {issue.comments} comments
                    </div>
                  </div>

                  <button className="w-full bg-slate-700/50 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all mt-auto shadow-sm">
                    Analyze with Groq
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
                {`No issues found for "${activeQuery}". Try another language!`}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
