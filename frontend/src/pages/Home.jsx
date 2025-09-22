// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";
import ProfileCard from "../components/ProfileCard";
import LoadingScreen from "../components/LoadingScreen";
import AnimatedCTA from "../components/AnimatedCTA";

export default function Home() {
  const [settings, setSettings] = useState(null); // api/pages/site-settings/
  const [home, setHome] = useState(null); // api/pages/home/ (paginated)
  const [resume, setResume] = useState(null); // optional api/pages/resume/
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState([]);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // for retry

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      setMissing([]);

      try {
        try { console.log("API baseURL:", API.defaults.baseURL); } catch (e) {}

        const [sRes, hRes, rRes] = await Promise.allSettled([
          API.get("pages/site-settings/"),
          API.get("pages/home/"),
          API.get("pages/resume/"),
        ]);

        if (!mounted) return;

        const normalize = (res) => {
          if (!res) return null;
          if (res.status !== "fulfilled") {
            console.error("API error:", res.reason);
            return null;
          }
          const data = res.value && res.value.data;
          console.log("API response:", { url: res.value?.config?.url, data });
          if (!data) return null;
          if (data.results && Array.isArray(data.results)) return data.results.length ? data.results[0] : null;
          if (Array.isArray(data)) return data.length ? data[0] : null;
          if (typeof data === "object") return data;
          return null;
        };

        const s = normalize(sRes);
        const h = normalize(hRes);
        const r = normalize(rRes);

        if (s) setSettings(s);
        if (h) setHome(h);
        if (r) setResume(r);

        const missingNow = [];
        if (!s) missingNow.push("SiteSettings (api/pages/site-settings/) — create one in admin");
        if (!h) missingNow.push("HomePage (api/pages/home/) — create one in admin");
        setMissing(missingNow);
      } catch (err) {
        console.error("Fetch error:", err);
        if (mounted) setError("Failed to fetch content from backend.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();
    return () => { mounted = false; };
  }, [refreshKey]);

  // Retry helper
  const handleRetry = () => {
    setError(null);
    setRefreshKey((k) => k + 1);
  };

  // If loading, show skeleton
  if (loading) {
    return <LoadingScreen />;
  }

  // If there's an error show small error UI with retry (not the full missing list)
  if (error) {
    return (
      <main className="min-h-auto flex items-center justify-center text-white">
        <div className="max-w-md text-center p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-red-400">Network error</h3>
          <p className="text-sm text-gray-300 mb-4">{error}</p>
          <div className="flex justify-center gap-3">
            <button onClick={handleRetry} className="px-4 py-2 rounded bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(90deg, #00FFFF, #8A2BE2)`, color: "black", fontWeight: 700 }}>
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  // If required content missing, show the skeleton (UX: don't show admin block)
  if (missing.length > 0) {
    return <LoadingScreen />;
  }

  // All required data exists (settings + home). Use backend values only.
  const primary = settings.primary_color;
  const secondary = settings.secondary_color;
  const roles = Array.isArray(home.roles) ? home.roles.map((r) => r.name) : [];

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="home-content"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.45 }}
        className="min-h-auto text-white"
        style={{ "--accent-c1": primary, "--accent-c2": secondary }}
      >
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">{settings.brand_name}</span>
                <span className="h-0.5 w-12" style={{ backgroundImage: `linear-gradient(90deg, ${primary}, ${secondary})` }} />
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{home.full_name}</h1>

              <div className="flex items-center gap-4">
                <span className="inline-block text-xl text-cyan-200 font-semibold"><RoleTicker roles={roles} /></span>
              </div>

              <p className="text-lg text-gray-300 max-w-2xl" style={{ whiteSpace: "pre-line" }}>{home.intro}</p>

              <div className="flex flex-wrap gap-3 mt-3 items-center">
               <AnimatedCTA to="/contact" text="Contact me" primary={primary} secondary={secondary} />

                {/* Download resume button (appears after Contact me) */}
                {resume && (resume.resume_file || resume.file) ? (
                  <a
                    href={resume.resume_file || resume.file}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-900"
                    aria-label="Download resume"
                  >
                    Download resume
                  </a>
                ) : null}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex justify-center md:justify-end">
              <ProfileCard
                name={home.full_name}
                intro={home.intro}
                roles={roles}
                profileImage={home.profile_image}
                primary={primary}
                secondary={secondary}
                socials={[]}
                showText={false}
              />
            </motion.div>
          </div>
        </section>
      </motion.main>
    </AnimatePresence>
  );
}

/* RoleTicker component (driven only by backend roles) */
function RoleTicker({ roles = [], speed = 70, pause = 1200 }) {
  const [idx, setIdx] = React.useState(0);
  const [sub, setSub] = React.useState(0);
  const [isDeleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!roles || roles.length === 0) return;
    const current = roles[idx] || "";
    const delta = isDeleting ? speed / 2 : speed;
    const t = setTimeout(() => { setSub((s) => s + (isDeleting ? -1 : 1)); }, delta);

    if (!isDeleting && sub === current.length + 1) {
      setTimeout(() => setDeleting(true), pause);
    } else if (isDeleting && sub === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % roles.length);
    }
    return () => clearTimeout(t);
  }, [sub, idx, isDeleting, roles, speed, pause]);

  const [blink, setBlink] = React.useState(true);
  React.useEffect(() => { const bi = setInterval(() => setBlink((b) => !b), 500); return () => clearInterval(bi); }, []);

  if (!roles || roles.length === 0) return null;
  const text = roles[idx].slice(0, Math.max(0, sub));
  return <span className="font-medium">{text}<span className="ml-1" style={{ opacity: blink ? 1 : 0 }}>|</span></span>;
}
