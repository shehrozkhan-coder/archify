import Navbar from "components/Navbar";
import type { Route } from "./+types/home";
import { ArrowRight, ArrowUpRight, Clock, Layers } from "lucide-react";
import Upload from "components/Upload";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  const handleUploadComplete = async (base64Image: string) => {
    const newId = Date.now().toString();

    navigate(`/visualizer/${newId}`);
    return true;
  }
  return (
    <div className="home">
      <Navbar />
      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>
          <p>Introducing ARCHIFY 2.0</p>
        </div>

        <h1>Build Beautiful spaces at the speed of thought with Archify</h1>
        <p className="subtitle">
          Archify is an AI-first design enivorment that helps you visualize,
          render, and ship architecture projects faster than ever.
        </p>

        <div className="actions">
          <a href="#upload" className="cta">
            Start Building <ArrowRight className="icon" />
          </a>

          <button
            className="
    bg-white 
    text-orange-600 
    font-semibold 
    px-6 py-3 
    rounded-lg 
    border border-orange-200
    shadow-sm 
    hover:bg-orange-50 
    hover:border-orange-300
    hover:shadow-md
    transition-all 
    duration-300 
    ease-in-out 
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2 
    focus:ring-orange-400
    cursor-pointer
  "
          >
            Watch Demo
          </button>
        </div>

        <div id="uplaod" className="upload-shell">
          <div className="grid-overlay"/>
          <div className="upload-card">
            <div className="upload-head">
              <div className="upload-icon">
                <Layers className="icon"/>
              </div>
              <h3>Upload your floor plan</h3>
              <p>Supports JPG, PNG, formats up to 10MB</p>
            </div>
            <Upload onComplete={handleUploadComplete}/>
          </div>
        </div>
      </section>

      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projects</h2>
              <p>Your latest work and shared community projects, all in one place</p>
            </div>
          </div>

          <div className="projects-grid">
            <div className="project-card group">
              <div className="preview">
                <img
                src="https://roomify-mlhuk267-dfwu1i.puter.site/projects/1770803585402/rendered.png"
                alt="Project"/>
                <div className="badge">
                  <span>Community</span>
                </div>
              </div>

              <div className="card-body">
                <div>
                  <h3>Project Lahore</h3>
                  <div className="meta">
                    <Clock size={12}/>
                    <span>{new Date("01.02.2026").toLocaleDateString()}</span>
                    <span>Buy Shehroz Khan</span>
                  </div>
                </div>
                <div className="arrow">
                  <ArrowUpRight size={18}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
