import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import API from "../api/axios";
import LoadingScreen from "../components/LoadingScreen";

function ProjectCard({ project }) {
  const { title, category, tools, image, slug } = project;
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      className="relative rounded-lg overflow-hidden shadow-lg"
      aria-label={title}
    >
      {/* Thumbnail */}
      <div className="w-full h-48 md:h-40 lg:h-48 bg-gray-800">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center text-gray-500">
            No image
          </div>
        )}
      </div>

      {/* overlay on hover */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="opacity-0 hover:opacity-100 bg-gradient-to-r from-cyan-400 to-purple-500 pointer-events-auto transition-opacity duration-200 w-full h-full flex items-center justify-center">
          <div className="w-full h-full backdrop-blur-sm flex flex-col items-center justify-center text-center px-4">
            <h4 className="text-xl font-semibold text-white">{title}</h4>
            <div className="mt-2 text-sm text-white/90">
              {category?.toUpperCase()}
            </div>
            {tools && (
              <div className="mt-2 text-sm text-white/80">TOOLS: {tools}</div>
            )}

            {/* Buttons: Live Demo + GitHub + Info */}
            <div className="mt-3 flex gap-3">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-medium"
                  style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.45)" }}
                >
                  Live Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-full border border-white/10 text-white hover:text-cyan-300 transition"
                >
                  GitHub
                </a>
              )}
              <Link
                to={`/work/${slug}`}
                className="px-3 py-2 rounded-full border border-white/10 text-white hover:text-purple-400 transition"
              >
                Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* card body */}
      <div className="p-4 border-t border-white/6 text-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-sm text-cyan-400">{category}</div>
        </div>
        {tools && <div className="mt-2 text-sm text-gray-400">{tools}</div>}
      </div>
    </motion.div>
  );
}

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3); // consistent with DRF PAGE_SIZE
  const [category, setCategory] = useState(""); // "", "ecommerce", "education", etc.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CATEGORY_OPTIONS = [
    { key: "", label: "All" },
    { key: "ecommerce", label: "E-Commerce" },
    { key: "education", label: "Education" },
    { key: "healthcare", label: "Healthcare" },
    { key: "productivity", label: "Productivity Tools" },
    { key: "other", label: "Other" },
  ];

  const fetchProjects = useCallback(
    async (opts = {}) => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: opts.page || page,
        };
        const activeCategory = opts.category !== undefined ? opts.category : category;
        if (activeCategory) params.category = activeCategory;

        const res = await API.get("pages/projects/", { params });
        const data = res.data || {};
        if (data.results) {
          setProjects(data.results);
          setCount(data.count || 0);
        } else if (Array.isArray(data)) {
          setProjects(data);
          setCount(data.length);
        } else {
          setProjects([]);
          setCount(0);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    },
    [page, category]
  );

  useEffect(() => {
    fetchProjects({ page, category });
  }, [fetchProjects, page, category]);

  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  function gotoPage(p) {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    fetchProjects({ page: p, category });
    window.scrollTo({ top: 200, behavior: "smooth" });
  }

  // handle category change (from buttons or mobile select)
  function handleCategoryChange(newCat) {
    setCategory(newCat);
    setPage(1);
    fetchProjects({ page: 1, category: newCat });
  }

  if (loading) return <LoadingScreen />;
  if (error)
    return (
      <main className="min-h-auto text-white flex items-center justify-center">
        <div className="bg-gray-900 p-6 rounded">{error}</div>
      </main>
    );

  return (
    <main className="min-h-auto text-white">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <motion.h2
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-center mb-8"
        >
          My{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Work
          </span>
        </motion.h2>

        {/* controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="w-full md:w-auto">
            {/* Desktop: pill buttons */}
            <div className="hidden md:flex items-center gap-3 flex-wrap">
              {CATEGORY_OPTIONS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => handleCategoryChange(c.key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    category === c.key
                      ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-black"
                      : "bg-white/3 text-gray-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Mobile: compact select */}
            <div className="md:hidden">
              <label className="sr-only" htmlFor="category-select">Filter by category</label>
              <div className="relative">
                <select
                  id="category-select"
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-white/6 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {/* <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="w-4 h-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
                  </svg>
                </div> */}
              </div>
            </div>
          </div>

          {/* (search removed) */}
        </div>

        {/* grid */}
        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* pagination */}
        <div className="flex items-center justify-center gap-3 my-10">
          <button
            onClick={() => gotoPage(page - 1)}
            disabled={!canPrev}
            className={`px-3 py-2 rounded ${
              canPrev
                ? "bg-white/5 hover:bg-white/8"
                : "bg-white/3 text-white/40"
            }`}
            aria-label="Previous page"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            if (
              totalPages > 7 &&
              Math.abs(p - page) > 2 &&
              p !== 1 &&
              p !== totalPages
            ) {
              if (p === 2 || p === totalPages - 1) {
                return (
                  <span key={p} className="px-3 py-2">
                    …
                  </span>
                );
              }
              return null;
            }
            return (
              <button
                key={p}
                onClick={() => gotoPage(p)}
                className={`px-3 py-2 rounded ${
                  p === page
                    ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-black"
                    : "bg-white/5 text-gray-200"
                }`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={() => gotoPage(page + 1)}
            disabled={!canNext}
            className={`px-3 py-2 rounded ${
              canNext
                ? "bg-white/5 hover:bg-white/8"
                : "bg-white/3 text-white/40"
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}

