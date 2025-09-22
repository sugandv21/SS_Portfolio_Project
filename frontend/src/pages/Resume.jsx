import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import LoadingScreen from "../components/LoadingScreen";

export default function Resume() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get("pages/resume/");
        if (!mounted) return;
        setResume(res.data || null);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load resume content.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, [refreshKey]);

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <main className="min-h-auto flex items-center justify-center text-white">
        <div className="max-w-md text-center p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-red-400">Network error</h3>
          <p className="text-sm text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="px-4 py-2 rounded font-semibold"
            style={{ backgroundImage: "linear-gradient(90deg, #00FFFF, #8A2BE2)", color: "black" }}
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!resume) {
    return (
      <main className="min-h-auto flex items-center justify-cente text-white">
        <div className="max-w-xl text-center p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">No resume content found</h3>
          <p className="text-sm text-gray-300">Create a ResumePage with Education/Experience items in admin.</p>
        </div>
      </main>
    );
  }

  const education = Array.isArray(resume.education) ? resume.education : [];
  const experience = Array.isArray(resume.experience) ? resume.experience : [];

  return (
    <main className="min-h-auto text-white">
      <section className="max-w-6xl mx-auto px-6 py-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-center mb-12"
        >
          My{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Resume
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* EDUCATION */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-gray-200">Education</h3>

            <div className="space-y-6">
              {education.length === 0 && (
                <p className="text-gray-400">No education entries yet.</p>
              )}

              {education.map((ed) => (
                <div key={ed.id} className="bg-gray-900/60 p-5 rounded-lg border border-white/6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-gray-100">{ed.title}</h4>
                      <div className="mt-2">
                        <span className="text-cyan-400 font-semibold">{ed.date_range}</span>
                      </div>
                      {ed.institution && (
                        <div className="mt-2 text-gray-400 italic">{ed.institution}</div>
                      )}
                      {ed.description && (
                        <p className="mt-3 text-gray-400">{ed.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* EXPERIENCE */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-gray-200">Professional Experience</h3>

            <div className="space-y-6">
              {experience.length === 0 && (
                <p className="text-gray-400">No experience entries yet.</p>
              )}

              {experience.map((ex) => (
                <div key={ex.id} className="bg-gray-900/60 p-5 rounded-lg border border-white/6">
                  <h4 className="text-lg font-bold text-gray-100">{ex.title}</h4>
                  <div className="mt-2">
                    <span className="text-cyan-400 font-semibold">{ex.date_range}</span>
                  </div>
                  {ex.company && <div className="mt-2 text-gray-400 italic">{ex.company}</div>}

                  {/* bullets (array from serializer) */}
                  {Array.isArray(ex.bullets) && ex.bullets.length > 0 && (
                    <ul className="list-disc pl-6 mt-3 text-gray-400 space-y-2">
                      {ex.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Download CTA centered */}
        {resume.resume_file && (
          <div className="flex justify-center my-10">
            <a
              href={resume.resume_file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-md font-semibold"
              style={{
                backgroundImage: "linear-gradient(90deg, #00FFFF, #8A2BE2)",
                color: "black",
              }}
            >
              Download Resume
            </a>
          </div>
        )}
      </section>
    </main>
  );
}

