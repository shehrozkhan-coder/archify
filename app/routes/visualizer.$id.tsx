import puter from "@heyputer/puter.js";
import { generate3DView } from "lib/ai.action";
import { Box, Download, DownloadCloud, RefreshCcw, Share2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const VisualizerId = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { initialImage, initialRender, name } = location.state || {};

  const hasInitialGenerate = useRef(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(
    initialRender || null,
  );

  const handleBack = () => navigate("/");

  const runGeneration = async () => {
    if (!initialImage) return;

    try {
      setIsProcessing(true);
      const result = await generate3DView({ sourceImage: initialImage });

      if (result.renderedImage) {
        setCurrentImage(result.renderedImage);

        // Update the project with the rendered image...
      }
    } catch (error) {
      console.error("Generation failed: ", error);
    } finally {
      setIsProcessing(false);
    }
  };
  useEffect(() => {
     console.log(Object.keys(puter.ai));  // ← yahan add karo
    if (!initialImage || hasInitialGenerate.current) return;
    if (initialRender) {
      setCurrentImage(initialRender);
      hasInitialGenerate.current = true;
    }
    hasInitialGenerate.current = true;
    runGeneration();
  }, [initialImage, initialRender]);

  return (
    <div className="visualizer">
      <nav className="topbar">
        <div className="brand">
          <Box className="logo text-orange-500" size={28} />
          <span className="name font-bold text-xl text-gray-800">ARCHIFY</span>
        </div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-gray-100 text-orange-600 text-sm font-medium backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-105 cursor-pointer"
        >
          <X className="w-4 h-4 text-orange-500" /> Exit Editor
        </button>
      </nav>

      <section className="content">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Project</p>
              <h2>{"Untitled Project"}</h2>
              <p className="note">Created by you</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {}}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white text-sm font-medium border border-zinc-700 hover:border-zinc-500 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-zinc-400 disabled:hover:border-zinc-700"
                disabled={!currentImage}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => {}}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-200 cursor-pointer shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          <div className={`render-area ${isProcessing ? 'is-processing' : ''}`}>
            {currentImage ? (
                <img src={currentImage} alt="AI Render" className="render-img"/>
            ): (
                <div className="render-placeholder">
                    {initialImage && (
                        <img src={initialImage} alt="Original" className="render-fallback"/>
                    )}
                </div>
            )}

            {isProcessing && (
                <div className="render-overlay">
                    <div className="rendering-card">
                        <RefreshCcw className="spinner"/>
                        <span className="title">Rendering...</span>
                        <span className="subtitle">Generating your 3D visualiztion</span>
                    </div>
                </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default VisualizerId;
