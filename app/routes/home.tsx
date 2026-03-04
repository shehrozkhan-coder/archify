import Navbar from "components/Navbar";
import type { Route } from "./+types/home";
import { ArrowRight, ArrowUpRight, Clock, Layers } from "lucide-react";
import Upload from "components/Upload";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { createProject, getProject } from "lib/puter.action";
import { motion } from "framer-motion";
import Footer from "components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Archify - AI Architecture Visualizer" },
    { name: "description", content: "Build beautiful spaces at the speed of thought." },
  ];
}

// Character by character animation
const CharReveal = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => {
  return (
    <span className={className} style={{ display: "inline" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: delay + i * 0.03,
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

// Orange dots background
const OrangeDots = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
    {Array.from({ length: 20 }).map((_, row) =>
      Array.from({ length: 20 }).map((_, col) => (
        <motion.div
          key={`${row}-${col}`}
          className="absolute rounded-full bg-orange-400"
          style={{
            width: 3,
            height: 3,
            left: `${(col / 19) * 100}%`,
            top: `${(row / 19) * 100}%`,
            opacity: 0.25,
          }}
          animate={{ opacity: [0.15, 0.45, 0.15] }}
          transition={{
            duration: 2.5 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))
    )}
  </div>
);

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const isCreatingProjectRef = useRef(false);

  const handleUploadComplete = async (base64Image: string) => {
    try {
      if (isCreatingProjectRef.current) return false;
      isCreatingProjectRef.current = true;
      const newId = Date.now().toString();
      const name = `Residence ${newId}`;

      const newItem = {
        id: newId, name, sourceImage: base64Image, renderedImage: undefined,
        timestamp: Date.now()
      };
      const saved = await createProject({ item: newItem, visibility: "private" });

      if (!saved) {
        console.log("Failed to create Project");
        return false;
      }
      setProjects((prev) => [newItem, ...prev]);

      navigate(`/visualizer/${newId}`, {
        state: {
          initialImage: saved.sourceImage,
          initialRenderImage: saved.renderedImage || null,
          name
        }
      });
      return true;
    } finally {
      isCreatingProjectRef.current = false;
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const items = await getProject();
      setProjects(items!);
    };
    fetchProjects();
  }, []);

  return (
    <div className="home">
      <Navbar />
      <section className="hero relative">
        {/* Orange dots background */}
        <OrangeDots />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Announce badge */}
          <motion.div
            className="announce"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="dot">
              <div className="pulse"></div>
            </div>
            <p>Introducing ARCHIFY 2.0</p>
          </motion.div>

          {/* Main heading - character by character */}
          <h1>
            <CharReveal
              text="Build Beautiful spaces at the speed of thought with Archify"
              delay={0.2}
            />
          </h1>

          {/* Subtitle */}
          <motion.p
            className="subtitle"
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            Archify is an AI-first design environment that helps you visualize,
            render, and ship architecture projects faster than ever.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            className="actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <motion.a
              href="#upload"
              className="cta group flex items-center gap-2"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Building
              <motion.span
                className="inline-flex"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowRight className="icon" />
              </motion.span>
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg border border-orange-200 shadow-sm hover:bg-orange-50 hover:border-orange-300 hover:shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 cursor-pointer"
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Upload section */}
          <motion.div
            id="upload"
            className="upload-shell"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3 }}
          >
            <div className="grid-overlay" />
            <div className="upload-card">
              <div className="upload-head">
                <div className="upload-icon">
                  <Layers className="icon" />
                </div>
                <h3>Upload your floor plan</h3>
                <p>Supports JPG, PNG, formats up to 10MB</p>
              </div>
              <Upload onComplete={handleUploadComplete} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects section */}
      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Projects
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Your latest work and shared community projects, all in one place
              </motion.p>
            </div>
          </div>

          <div className="projects-grid">
            {projects.map(({ id, name, renderedImage, sourceImage, timestamp }, i) => (
              <motion.div
                key={id}
                className="project-card group"
                onClick={() => navigate(`/visualizer/${id}`)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.01 }}
              >
                <div className="preview">
                  <img src={renderedImage || sourceImage} alt="Project" />
                  <div className="badge">
                    <span>Community</span>
                  </div>
                </div>

                <div className="card-body">
                  <div>
                    <h3>{name}</h3>
                    <div className="meta">
                      <Clock size={12} />
                      <span>{new Date(timestamp).toLocaleDateString()}</span>
                      <span>By Shehroz Khan</span>
                    </div>
                  </div>
                  <div className="arrow">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}