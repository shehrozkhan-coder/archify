import puter from "@heyputer/puter.js";
import Footer from "components/Footer";
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
    <nav className="topbar flex items-center justify-between px-4 md:px-8 py-4 border-b border-gray-100 bg-white">
        <div className="brand flex items-center gap-2">
            <Box className="logo text-orange-500" size={24} />
            <span className="font-bold text-lg text-gray-800">ARCHIFY</span>
        </div>
        <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-white/10 hover:bg-gray-100 text-orange-600 text-sm font-medium border border-gray-200 transition-all duration-200 hover:scale-105 cursor-pointer"
        >
            <X className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">Exit Editor</span>
        </button>
    </nav>

    <section className="content flex flex-col lg:flex-row gap-4 p-4 md:p-6">

        {/* Main Panel */}
        <div className="panel flex-1 min-w-0">
            <div className="panel-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="panel-meta">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Project</p>
                    <h2 className="text-lg font-bold text-gray-900">{project?.name || `Residence ${id}`}</h2>
                    <p className="note text-xs text-gray-400">Created by you</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDownload}
                        disabled={!currentImage || isDownloading}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white text-sm font-medium border border-zinc-700 hover:border-zinc-500 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <Download className={`w-4 h-4 ${isDownloading ? "animate-bounce" : ""}`} />
                        <span className="hidden sm:inline">{isDownloading ? "Downloading..." : "Export"}</span>
                    </button>
                    <button
                        onClick={handleShare}
                        disabled={!currentImage}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 cursor-pointer shadow-md shadow-indigo-500/20"
                    >
                        {isCopied ? (
                            <>
                                <Check className="w-4 h-4" />
                                <span className="hidden sm:inline">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Share2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Share</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className={`render-area ${isProcessing ? "is-processing" : ""}`}>
                {currentImage ? (
                    <img src={currentImage} alt="AI Render" className="render-img w-full rounded-xl object-cover" />
                ) : (
                    <div className="render-placeholder">
                        {project?.sourceImage && (
                            <img src={project?.sourceImage} alt="Original" className="render-fallback w-full rounded-xl object-cover opacity-40" />
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

        {/* Compare Panel */}
        <div className="panel-compare w-full lg:w-80 xl:w-96">
            <div className="panel-header flex items-center justify-between mb-4">
                <div className="panel-meta">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Comparison</p>
                    <h3 className="text-base font-bold text-gray-900">Before and After</h3>
                </div>
                <div className="hint text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                    Drag to compare
                </div>
            </div>
            <div className="compare-stage rounded-xl overflow-hidden">
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
                            <img src={project.sourceImage} alt="Before" className="compare-img w-full rounded-xl" />
                        )}
                    </div>
                )}
            </div>
        </div>

    </section>

    <Footer />
</div>
    );
};

export default VisualizerId;