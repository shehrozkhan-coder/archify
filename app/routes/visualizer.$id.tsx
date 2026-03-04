import puter from "@heyputer/puter.js";
import { generate3DView } from "lib/ai.action";
import { createProject, getProjectById } from "lib/puter.action";
import { Box, Check, Copy, Download, RefreshCcw, Share2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { useNavigate, useOutletContext, useParams } from "react-router";

const VisualizerId = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userId } = useOutletContext<AuthContext>();

    const hasInitialGenerate = useRef(false);

    const [project, setProject] = useState<DesignItem | null>(null);
    const [isProjectLoading, setIsProjectLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleBack = () => navigate("/");

    const handleDownload = async () => {
        if (!currentImage) return;
        setIsDownloading(true);
        try {
            const response = await fetch(currentImage);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${project?.name || "archify-render"}.png`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = async () => {
        if (!currentImage) return;
        try {
            await navigator.clipboard.writeText(currentImage);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500);
        } catch (error) {
            console.error("Share failed:", error);
        }
    };

    const runGeneration = async (item: DesignItem) => {
        if (!id || !item.sourceImage) return;

        try {
            setIsProcessing(true);
            const result = await generate3DView({ sourceImage: item.sourceImage });

            if (result.renderedImage) {
                setCurrentImage(result.renderedImage);

                const updatedItem = {
                    ...item,
                    renderedImage: result.renderedImage,
                    renderedPath: result.renderedPath,
                    timestamp: Date.now(),
                    ownerId: item.ownerId ?? userId ?? null,
                    isPublic: item.isPublic ?? false,
                };
                const saved = await createProject({ item: updatedItem, visibility: "private" });

                if (saved) {
                    setProject(saved);
                    setCurrentImage(saved.renderedImage || result.renderedImage);
                }
            }
        } catch (error) {
            console.error("Generation failed: ", error);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadProject = async () => {
            if (!id) {
                setIsProjectLoading(false);
                return;
            }

            setIsProjectLoading(true);
            const fetchedProject = await getProjectById({ id });

            if (!isMounted) return;

            setProject(fetchedProject);
            setCurrentImage(fetchedProject?.renderedImage || null);
            setIsProjectLoading(false);
            hasInitialGenerate.current = false;
        };

        loadProject();

        return () => {
            isMounted = false;
        };
    }, [id]);

    useEffect(() => {
        if (isProjectLoading || hasInitialGenerate.current || !project?.sourceImage) return;

        if (project.renderedImage) {
            setCurrentImage(project.renderedImage);
            hasInitialGenerate.current = true;
            return;
        }

        hasInitialGenerate.current = true;
        void runGeneration(project);
    }, [project, isProjectLoading]);

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
                            <h2>{project?.name || `Residence ${id}`}</h2>
                            <p className="note">Created by you</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleDownload}
                                disabled={!currentImage || isDownloading}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white text-sm font-medium border border-zinc-700 hover:border-zinc-500 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-zinc-400 disabled:hover:border-zinc-700"
                            >
                                <Download className={`w-4 h-4 ${isDownloading ? "animate-bounce" : ""}`} />
                                {isDownloading ? "Downloading..." : "Export"}
                            </button>
                            <button
                                onClick={handleShare}
                                disabled={!currentImage}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 cursor-pointer shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40"
                            >
                                {isCopied ? (
                                    <>
                                        <Check className="w-4 h-4" /> Copied!
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="w-4 h-4" /> Share
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className={`render-area ${isProcessing ? "is-processing" : ""}`}>
                        {currentImage ? (
                            <img src={currentImage} alt="AI Render" className="render-img" />
                        ) : (
                            <div className="render-placeholder">
                                {project?.sourceImage && (
                                    <img src={project?.sourceImage} alt="Original" className="render-fallback" />
                                )}
                            </div>
                        )}

                        {isProcessing && (
                            <div className="render-overlay">
                                <div className="rendering-card">
                                    <RefreshCcw className="spinner" />
                                    <span className="title">Rendering...</span>
                                    <span className="subtitle">Generating your 3D visualization</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="panel-compare">
                    <div className="panel-header">
                        <div className="panel-meta">
                            <p>Comparison</p>
                            <h3>Before and After</h3>
                        </div>
                        <div className="hint">Drag to compare</div>
                    </div>
                    <div className="compare-stage">
                        {project?.sourceImage && currentImage ? (
                            <ReactCompareSlider
                                defaultValue={50}
                                style={{ width: "100%", height: "auto" }}
                                itemOne={
                                    <ReactCompareSliderImage src={project?.sourceImage} alt="before" className="compare-img" />
                                }
                                itemTwo={
                                    <ReactCompareSliderImage src={currentImage || project?.renderedImage} alt="after" className="compare-img" />
                                }
                            />
                        ) : (
                            <div className="compare-fallback">
                                {project?.sourceImage && (
                                    <img src={project.sourceImage} alt="Before" className="compare-img" />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VisualizerId;