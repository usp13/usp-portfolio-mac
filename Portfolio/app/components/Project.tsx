import React from 'react';
import Image from 'next/image';
import { Github, Play, Image as ImageIcon, ArrowUpRight } from 'lucide-react';

interface Project {
  title: string;
  tagline: string;
  description: string;
  deployedUrl?: string;
  githubUrl: string;
  youtubeUrl?: string;
  imageUrl?: string;
  technologies: string[];
}

const initialProjects: Project[] = [
  {
    title: "InterReview",
    tagline: "Intelligent Mock Interview Evaluation Engine",
    description: "A full-stack AI-driven mock interview simulation platform. Users upload their resume to automatically generate targeted technical or HR questions via an LLM, conduct timed simulated sessions, and receive detailed scoring on confidence, communication, and correctness.",
    deployedUrl: "https://inter-review-gamma.vercel.app",
    githubUrl: "https://github.com/usp13/InterReview",
    // Paste image path here later (e.g. "/Projects/macos.png")
    imageUrl: "",
    technologies: ["React", "Next.js", "LLM", "Speech & Audio", "AI Evaluation", "Tailwind CSS", "JavaScript"]
  },
  {
    title: "BuildYourOwnRAG",
    tagline: "First-Principles Retrieval-Augmented Generation",
    description: "A systems-engineering research implementation of a complete RAG pipeline built from scratch — encompassing document parsing, chunking heuristics, dense vector embedding computation, similarity search, and contextual synthesis without third-party black-box wrappers.",
    githubUrl: "https://github.com/usp13/BuildYourOwnRAG",
    // Paste image path here later (e.g. "/Projects/agamify2.png")
    imageUrl: "",
    technologies: ["RAG", "Vector Search", "Systems Engineering", "Embeddings", "Node.js", "AI Architecture"]
  },
  {
    title: "QuickCL",
    tagline: "Customs Documentation Automation & OCR Platform",
    description: "Enterprise customs documentation automation platform that extracts and structures 140+ fields from commercial invoices, packing lists, and bills of lading. Employs OCR and AI document processing to cut manual data entry from 60 minutes to under 30 seconds with automatic HS code verification.",
    deployedUrl: "https://www.quickcl.mapsai.in",
    githubUrl: "https://github.com/usp13/QuickCL",
    // Paste image path here later (e.g. "/Projects/echonet.png")
    imageUrl: "",
    technologies: ["Document AI", "OCR", "Computer Vision", "Next.js", "Fast Processing", "JavaScript"]
  },
  {
    title: "DND Alert Engine",
    tagline: "High-Throughput Asynchronous Notification Router",
    description: "Resilient alert dispatching engine engineered in TypeScript with asynchronous event scheduling, priority filtering queues, and fault-tolerant notification routing for high-traffic environments.",
    githubUrl: "https://github.com/usp13/DND-Alert-Engine",
    // Paste image path here later (e.g. "/Projects/dhaniverse.png")
    imageUrl: "",
    technologies: ["TypeScript", "Event-Driven", "Node.js", "Async Processing", "High Throughput"]
  },
  {
    title: "ScamShield",
    tagline: "Cybersecurity Threat & Phishing Detection Platform",
    description: "A cybersecurity threat mitigation and awareness platform engineered to identify, analyze, and protect users against emerging phishing campaigns, malicious domains, and fraudulent payment gateways.",
    githubUrl: "https://github.com/usp13/ScamShield-CyberSecurity",
    // Paste image path here later (e.g. "/Projects/jiva.png")
    imageUrl: "",
    technologies: ["Cybersecurity", "Threat Analysis", "Fraud Detection", "HTML5", "JavaScript"]
  },
  {
    title: "LeetSync",
    tagline: "Automated Algorithmic Problem Synchronization in C++",
    description: "Algorithmic problem-solving synchronization and automated tracking utility written in C++ for tracking code efficiency, time complexity benchmarks, and Git repository synchronizations.",
    githubUrl: "https://github.com/usp13/LeetSync",
    // Paste image path here later (e.g. "/Projects/blogit.png")
    imageUrl: "",
    technologies: ["C++", "Algorithms", "Data Structures", "Automation", "Git Integration"]
  }
];

const Projects: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Apple Product Tile Header */}
      <div className="text-center mb-10 sm:mb-14">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-apple-blue mb-2">
          Featured Engineering
        </p>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-apple-display text-apple-ink dark:text-white mb-3">
          Projects & Innovations
        </h1>
        <p className="text-[17px] leading-[1.47] text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Production applications, generative AI pipelines, and low-level systems built with precision.
        </p>
      </div>

      {/* Grid of Apple Store Utility Cards (design.md: rounded-[18px], 1px hairline, Action Blue CTAs) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {initialProjects.map((project, index) => (
          <div
            key={index}
            className="flex flex-col bg-white dark:bg-apple-tile-1 rounded-apple-card border border-apple-hairline dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* Project Image Tile with Apple Signature Product Shadow */}
            <div className="relative aspect-video w-full bg-apple-parchment dark:bg-apple-tile-2 overflow-hidden flex items-center justify-center p-6">
              {project.imageUrl ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden shadow-apple-product">
                  <Image
                    src={project.imageUrl}
                    alt={`${project.title} preview`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-black/[0.02] to-black/[0.06] dark:from-white/[0.02] dark:to-white/[0.06] border border-black/5 dark:border-white/5 flex flex-col items-center justify-center p-4 text-center select-none">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-apple-tile-3 shadow-apple-card flex items-center justify-center text-apple-blue mb-2">
                    <ImageIcon className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {project.title}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                    Image Preview Unlinked
                  </span>
                </div>
              )}

              {/* Video Overlay if present */}
              {project.youtubeUrl && (
                <a
                  href={project.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Watch Demo"
                  className="absolute inset-0 bg-black/20 hover:bg-black/40 flex items-center justify-center transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/95 text-apple-ink flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </a>
              )}
            </div>

            {/* Card Content Area */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-apple-blue tracking-wide uppercase">
                  {project.tagline}
                </span>
                <h2 className="text-2xl font-semibold tracking-apple-tight text-apple-ink dark:text-white">
                  {project.title}
                </h2>
                <p className="text-[15px] sm:text-[16px] leading-[1.5] text-gray-600 dark:text-gray-300">
                  {project.description}
                </p>
              </div>

              {/* Technology Tags (Apple Pill Chips) */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.technologies.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 text-xs font-medium rounded-full bg-apple-parchment dark:bg-apple-tile-2 text-apple-ink dark:text-gray-200 border border-apple-hairline dark:border-white/5"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Apple Action Buttons (design.md: button-primary Action Blue #0066cc pill + button-secondary-pill) */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-apple-hairline dark:border-white/10">
                {project.deployedUrl && (
                  <a
                    href={project.deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apple-press inline-flex items-center justify-center px-5 py-2 rounded-full bg-apple-blue hover:bg-apple-blue-focus text-white text-[15px] font-medium shadow-sm transition-all"
                  >
                    <span>Live Demo</span>
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </a>
                )}

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`apple-press inline-flex items-center justify-center px-5 py-2 rounded-full text-[15px] font-medium transition-all ${
                    project.deployedUrl
                      ? "border border-apple-blue text-apple-blue hover:bg-apple-blue/10 dark:text-apple-blue-dark dark:border-apple-blue-dark"
                      : "bg-apple-blue hover:bg-apple-blue-focus text-white shadow-sm"
                  }`}
                >
                  <Github className="w-4 h-4 mr-1.5" />
                  <span>View Code</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
