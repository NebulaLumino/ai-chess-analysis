"use client";
import { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState<Record<string, string>>({
      "timeControl": "Bullet (1+0)",
      "skillLevel": "Beginner (<1000)",
      "openingPreference": "1.e4 (Open)",
      "focusArea": "Opening Theory",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        timeControl: formData["timeControl"],
        skillLevel: formData["skillLevel"],
        openingPreference: formData["openingPreference"],
        focusArea: formData["focusArea"],
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data.result);
    } catch { setError("Failed to generate content."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-lime-950 via-slate-900 to-lime-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-lime-400 to-lime-200 bg-clip-text text-transparent">
            ♟️ AI Chess Analyst
          </h1>
          <p className="text-slate-400">Get personalized chess training and opening repertoires</p>
        </header>

        <form onSubmit={handleGenerate} className="bg-slate-800/60 backdrop-blur rounded-2xl p-6 mb-8 border border-lime-500/20 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-lime-300 mb-2">Time Control</label>
              <select value={formData["timeControl"]} onChange={e => setFormData({...formData, "timeControl": e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500">
                {Array.from({length: 6}).map((_, i) => <option key={i}>{["Bullet (1+0)", "Blitz (3+0)", "Blitz (5+3)", "Rapid (10+5)", "Classical (30+0)", "Correspondence"]}[i]</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-lime-300 mb-2">Skill Level</label>
              <select value={formData["skillLevel"]} onChange={e => setFormData({...formData, "skillLevel": e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500">
                {Array.from({length: 5}).map((_, i) => <option key={i}>{["Beginner (<1000)", "Intermediate (1000-1400)", "Advanced (1400-1800)", "Expert (1800-2000)", "Master (2000+)"]}[i]</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-lime-300 mb-2">Opening Preference</label>
              <select value={formData["openingPreference"]} onChange={e => setFormData({...formData, "openingPreference": e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500">
                {Array.from({length: 5}).map((_, i) => <option key={i}>{["1.e4 (Open)", "1.d4 (Closed)", "1.c4 (English)", "1.Nf3 (Reti)", "Any / Versatile"]}[i]</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-lime-300 mb-2">Focus Area</label>
              <select value={formData["focusArea"]} onChange={e => setFormData({...formData, "focusArea": e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500">
                {Array.from({length: 7}).map((_, i) => <option key={i}>{["Opening Theory", "Middlegame Strategy", "Endgame Technique", "Tactics", "Positional Play", "Time Management", "All-Round"]}[i]</option>)}
              </select>
            </div>          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-lime-600 to-lime-500 hover:from-lime-500 hover:to-lime-400 rounded-xl font-semibold text-white transition-all disabled:opacity-50">
            {loading ? "Generating..." : "♟️ Generate"}
          </button>
        </form>

        {error && <div className="bg-red-900/40 border border-red-500/40 rounded-xl p-4 text-red-300 mb-6">{error}</div>}

        {result && (
          <div className="bg-slate-800/60 backdrop-blur rounded-2xl p-6 border border-lime-500/20">
            <h2 className="text-xl font-bold text-lime-300 mb-4">Generated Content</h2>
            <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">{result}</div>
          </div>
        )}
      </div>
    </main>
  );
}
