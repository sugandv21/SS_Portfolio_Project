import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import LoadingScreen from "../components/LoadingScreen";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    API.get(`pages/projects/${slug}/`)
      .then((res) => {
        if (mounted) setProject(res.data);
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) return <LoadingScreen />;
  if (!project)
    return (
      <main className="text-center py-20 text-red-400">Project not found</main>
    );

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-5xl mx-auto px-6 py-12">
        <Link to="/work" className="text-cyan-400 hover:underline">
          &larr; Back to Work
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold mt-6"
        >
          {project.title}
        </motion.h1>

        {/* {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="mt-6 rounded-lg shadow-lg w-full max-h-96 object-cover"
          />
          
        )} */}

        {project.description && (
  <div
    className="mt-6 text-lg text-gray-300 leading-relaxed"
    dangerouslySetInnerHTML={{ __html: project.description }}
  />
)}

        {/* {project.tools && (
          <p className="mt-4 text-gray-400">
            <span className="text-cyan-400 font-medium">Tools:</span>{" "}
            {project.tools}
          </p>
        )} */}

        <div className="my-6 flex gap-4">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold"
            >
              Live Demo
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border border-white/10 text-white hover:text-cyan-300"
            >
              GitHub
            </a>
          )}
        </div>
      </section>
    </main>
  );
}

