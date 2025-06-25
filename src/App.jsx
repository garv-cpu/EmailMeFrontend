import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const emailTypes = [
  "Cold Email",
  "Client Follow-up",
  "Apology Email",
  "Feedback Request",
  "Thank You Email",
];

export default function App() {
  const [type, setType] = useState("Cold Email");
  const [context, setContext] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!context.trim()) return alert("Please enter some context");

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("https://emailmebackend.onrender.com/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: `${type}: ${context}` }),
      });

      const data = await res.json();
      setResponse(data.email);
    } catch (err) {
      console.error(err);
      setResponse("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans transition-all">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto bg-gray-800 shadow-2xl rounded-2xl p-6 space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-cyan-400">EmailMe!</h1>

        <div className="space-y-2">
          <label className="block font-semibold">Select Email Type</label>
          <select
            className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded-lg text-white"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {emailTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Enter the Context</label>
          <textarea
            className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded-lg text-white"
            rows="4"
            placeholder="e.g. Apologize to a customer for delay in delivery"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        <button
          className={`w-full py-2 rounded-lg transition-all font-semibold ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-cyan-500 hover:bg-cyan-600"
          }`}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <motion.div
              className="flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.6 }}
            >
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <span className="ml-2">Generating...</span>
            </motion.div>
          ) : (
            "Generate Email"
          )}
        </button>

        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-gray-700 p-4 rounded-lg border border-gray-600 text-sm whitespace-pre-wrap"
            >
              <h2 className="font-semibold mb-2 text-cyan-300">Generated Email:</h2>
              <p>{response}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
