import React from "react";
import { Github, Twitter, Mail, MapPin, Brain, Code2, Cpu, ShieldCheck, ArrowUpRight } from "lucide-react";

const ProfileCard = () => {
  return (
    <div className="p-6 sm:p-10 lg:p-12 space-y-10 max-w-5xl mx-auto">
      {/* Apple Hero Header */}
      <div className="text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-apple-blue">
          Biography & Background
        </p>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-apple-display text-apple-ink dark:text-white">
          Utsav Shailesh Panchal
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 font-medium">
          Full-Stack Developer & AI Systems Engineer
        </p>

        {/* Contact Strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm pt-2">
          <a
            href="mailto:utsavpanchal1304@gmail.com"
            className="flex items-center gap-1.5 text-apple-blue hover:underline"
          >
            <Mail className="w-4 h-4" />
            <span>utsavpanchal1304@gmail.com</span>
          </a>
          <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
          <a
            href="https://github.com/usp13"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-apple-blue hover:underline"
          >
            <Github className="w-4 h-4" />
            <span>github.com/usp13</span>
          </a>
          <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
          <a
            href="https://x.com/theutsavpanchal"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-apple-blue hover:underline"
          >
            <Twitter className="w-4 h-4" />
            <span>@theutsavpanchal</span>
          </a>
          <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
          <span className="flex items-center gap-1 text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>India</span>
          </span>
        </div>

        <p className="text-[17px] leading-[1.47] text-gray-700 dark:text-gray-300 max-w-3xl mx-auto pt-3">
          Passionate software engineer focused on building robust full-stack applications, intelligent Generative AI & RAG pipelines, and high-throughput systems. Experienced in creating AI-driven developer tooling, asynchronous notification routers, automated document extraction platforms, and modern web architectures.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <a
            href="https://github.com/usp13"
            target="_blank"
            rel="noreferrer"
            className="apple-press inline-flex items-center px-6 py-2.5 rounded-full bg-apple-blue hover:bg-apple-blue-focus text-white text-[15px] font-medium shadow-sm transition-all"
          >
            <span>Explore Repositories</span>
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </a>
          <a
            href="mailto:utsavpanchal1304@gmail.com"
            className="apple-press inline-flex items-center px-6 py-2.5 rounded-full border border-apple-blue text-apple-blue hover:bg-apple-blue/10 dark:text-apple-blue-dark dark:border-apple-blue-dark text-[15px] font-medium transition-all"
          >
            <span>Get in Touch</span>
          </a>
        </div>
      </div>

      {/* 4 Pillars - Apple Utility Cards (18px radius) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white dark:bg-apple-tile-1 border border-apple-hairline dark:border-white/10 p-5 rounded-apple-card shadow-apple-card transition-all">
          <div className="w-10 h-10 rounded-full bg-apple-parchment dark:bg-apple-tile-2 flex items-center justify-center text-apple-blue mb-4">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-apple-ink dark:text-white text-base tracking-tight mb-1">
            Generative AI & RAG
          </h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            End-to-end RAG pipelines from first principles, Gemini AI assistants, and LLM evaluation engines.
          </p>
        </div>

        <div className="bg-white dark:bg-apple-tile-1 border border-apple-hairline dark:border-white/10 p-5 rounded-apple-card shadow-apple-card transition-all">
          <div className="w-10 h-10 rounded-full bg-apple-parchment dark:bg-apple-tile-2 flex items-center justify-center text-apple-blue mb-4">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-apple-ink dark:text-white text-base tracking-tight mb-1">
            Full-Stack Platforms
          </h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Production MERN & Next.js web applications with responsive architecture and secure cloud deployments.
          </p>
        </div>

        <div className="bg-white dark:bg-apple-tile-1 border border-apple-hairline dark:border-white/10 p-5 rounded-apple-card shadow-apple-card transition-all">
          <div className="w-10 h-10 rounded-full bg-apple-parchment dark:bg-apple-tile-2 flex items-center justify-center text-apple-blue mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-apple-ink dark:text-white text-base tracking-tight mb-1">
            Systems & C++
          </h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            High-throughput asynchronous alert dispatchers, priority event queues, and algorithmic performance utilities.
          </p>
        </div>

        <div className="bg-white dark:bg-apple-tile-1 border border-apple-hairline dark:border-white/10 p-5 rounded-apple-card shadow-apple-card transition-all">
          <div className="w-10 h-10 rounded-full bg-apple-parchment dark:bg-apple-tile-2 flex items-center justify-center text-apple-blue mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-apple-ink dark:text-white text-base tracking-tight mb-1">
            Security & Reliability
          </h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Threat detection systems, OCR automated extraction verification, and scalable data processing.
          </p>
        </div>
      </div>

      {/* Technical Stack (Apple Spec Table Layout) */}
      <div className="bg-white dark:bg-apple-tile-1 border border-apple-hairline dark:border-white/10 rounded-apple-card p-6 sm:p-8 shadow-apple-card">
        <h2 className="text-2xl font-semibold tracking-apple-tight text-apple-ink dark:text-white mb-6">
          Technical Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-apple-blue">
              Languages
            </h4>
            <div className="flex flex-wrap gap-2">
              {["JavaScript (ES6+)", "TypeScript", "C++", "Python", "HTML5", "CSS3", "SQL"].map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-apple-parchment dark:bg-apple-tile-2 text-apple-ink dark:text-white border border-apple-hairline dark:border-white/5"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-apple-blue">
              Frameworks & Libraries
            </h4>
            <div className="flex flex-wrap gap-2">
              {["React.js", "Next.js", "Node.js", "Express.js", "Tailwind CSS", "MERN Stack", "REST APIs"].map((fw) => (
                <span
                  key={fw}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-apple-parchment dark:bg-apple-tile-2 text-apple-ink dark:text-white border border-apple-hairline dark:border-white/5"
                >
                  {fw}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-apple-blue">
              AI, Systems & DevOps
            </h4>
            <div className="flex flex-wrap gap-2">
              {["RAG Pipelines", "Google Gemini AI", "Vector Search", "MongoDB", "PostgreSQL", "Docker", "Git", "Vercel"].map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-apple-parchment dark:bg-apple-tile-2 text-apple-ink dark:text-white border border-apple-hairline dark:border-white/5"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;