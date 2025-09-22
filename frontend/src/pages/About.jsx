// src/pages/About.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import LoadingScreen from "../components/LoadingScreen";

export default function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get("pages/about/");
        if (!mounted) return;
        setAbout(res.data || null);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load About content.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  const handleRetry = () => {
    setError(null);
    setRefreshKey((k) => k + 1);
  };

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <main className="min-h-auto flex items-center justify-center text-white">
        <div className="max-w-md text-center p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-red-400">Network error</h3>
          <p className="text-sm text-gray-300 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded font-semibold"
            style={{
              backgroundImage: `linear-gradient(90deg, #00FFFF, #8A2BE2)`,
              color: "black",
            }}
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!about) {
    return (
      <main className="min-h-auto flex items-center justify-center text-white">
        <div className="max-w-xl text-center p-6 bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Content missing</h3>
          <p className="text-sm text-gray-300">
            No About content found. Create an AboutPage instance in Django admin.
          </p>
        </div>
      </main>
    );
  }

  const skills = Array.isArray(about.skills) ? about.skills : [];

  return (
    <main className="min-h-auto text-white">
      <section className="max-w-6xl mx-auto px-6 py-12 mb-12">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-center mb-12"
        >
          About{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Me
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Personal Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-300 whitespace-pre-line leading-relaxed">
              {about.intro}
            </p>

           <ul className="list-disc pl-6 text-sm space-y-2">
  {about.title && (
    <li className="flex gap-2">
      <strong className="min-w-[80px] bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        Name:
      </strong>
      <span className="text-gray-200">{about.title}</span>
    </li>
  )}

  {about.email && (
    <li className="flex gap-2">
      <strong className="min-w-[80px] bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        Email:
      </strong>
      <a
        href={`mailto:${about.email}`}
        className="text-gray-200 hover:text-cyan-300 transition"
      >
        {about.email}
      </a>
    </li>
  )}

  {about.location && (
    <li className="flex gap-2">
      <strong className="min-w-[80px] bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        From:
      </strong>
      <span className="text-gray-200">{about.location}</span>
    </li>
  )}

  {about.phone && (
    <li className="flex gap-2">
      <strong className="min-w-[80px] bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        Phone:
      </strong>
      <a
        href={`tel:${about.phone}`}
        className="text-gray-200 hover:text-cyan-300 transition"
      >
        {about.phone}
      </a>
    </li>
  )}
</ul>

          </motion.div>

          {/* Right: Skills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              My Skills
            </h3>
            <div className="space-y-4">
              {skills.length === 0 && (
                <p className="text-gray-400">No skills added yet (add via admin).</p>
              )}
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="w-full"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-200">
                      {skill.name}
                    </span>
                    <span className="text-sm text-gray-400">{skill.percent}%</span>
                  </div>
                  <div
                    className="w-full bg-white/5 rounded-full h-4"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={skill.percent}
                    aria-label={`${skill.name} proficiency`}
                  >
                    <motion.div
                      className="h-4 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.percent}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      style={{
                        backgroundImage: `linear-gradient(90deg, #00FFFF, #8A2BE2)`,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
