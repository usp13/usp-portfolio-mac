import React from "react";
import { Briefcase, Cpu, FileText, Code2 } from "lucide-react";

const WorkExperience: React.FC = () => {
  const experiences = [
    {
      title: "Generative AI & Full-Stack Platform Engineer",
      subtitle: "Independent Engineering & Open Source Projects",
      period: "2025 – Present",
      icon: <Code2 className="w-5 h-5 text-apple-blue" />,
      tag: "AI & Full-Stack",
      highlights: [
        "Architected and deployed Resumify, a full-stack career platform utilizing Google Gemini AI to analyze resumes, score job-fit alignment against job descriptions, and generate tailored interview preparation roadmaps with ATS optimization.",
        "Engineered InterReview, a mock interview evaluation system using LLMs to generate dynamic questions from candidate resumes and score responses across confidence, communication, and technical correctness.",
        "Built BuildYourOwnRAG from first principles, writing a complete Retrieval-Augmented Generation pipeline covering text parsing, chunking, dense vector embedding calculation, and semantic similarity search."
      ]
    },
    {
      title: "Customs Documentation Automation Engineer",
      subtitle: "QuickCL — AI Document Extraction",
      period: "2025",
      icon: <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      tag: "Computer Vision & OCR",
      highlights: [
        "Implemented OCR and AI document extraction platform parsing 140+ fields from complex international shipping documents (Commercial Invoices, Packing Lists, Bills of Lading).",
        "Reduced manual processing duration from 30–60 minutes down to under 30 seconds with automatic HS code verification and structured data normalization.",
        "Engineered intuitive web workflows for document review, correction verification, and seamless multi-format exports."
      ]
    },
    {
      title: "Systems & Network Software Engineer",
      subtitle: "Low-Level Protocols & Systems Architecture",
      period: "2024 – 2025",
      icon: <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      tag: "C++ & Systems",
      highlights: [
        "Architected distributed microservices and asynchronous event handling pipelines in TypeScript and C++ for reliable high-throughput message processing.",
        "Engineered DND Alert Engine in TypeScript, featuring asynchronous priority queue management, non-blocking event loops, and resilient notification routing.",
        "Authored LeetSync in C++ to automate problem sync and benchmarking of algorithmic solutions and data structures."
      ]
    },
    {
      title: "Full-Stack API & Platform Assignments",
      subtitle: "FlyRank AI & Shipmnts Engineering Tasks",
      period: "2024",
      icon: <Briefcase className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      tag: "Backend & APIs",
      highlights: [
        "Designed and implemented high-throughput RESTful CRUD APIs, schema validations, and MongoDB integrations adhering to scalable production patterns.",
        "Integrated secure endpoint authentication, asynchronous handlers, and automated test coverage."
      ]
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-apple-blue">
          Career Milestones
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-apple-display text-apple-ink dark:text-white">
          Experience & Engineering
        </h1>
        <p className="text-[17px] text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A track record of shipping intelligent platforms, OCR pipelines, and low-level software.
        </p>
      </div>

      {/* Experience Timeline Cards */}
      <div className="space-y-6">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-apple-tile-1 border border-apple-hairline dark:border-white/10 rounded-apple-card p-6 sm:p-8 shadow-apple-card hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-apple-hairline dark:border-white/10 gap-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-apple-parchment dark:bg-apple-tile-2 flex items-center justify-center">
                  {exp.icon}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-apple-ink dark:text-white tracking-tight">
                    {exp.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {exp.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:self-center">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-apple-parchment dark:bg-apple-tile-2 text-apple-ink dark:text-gray-200 border border-apple-hairline dark:border-white/5">
                  {exp.tag}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-apple-blue/10 text-apple-blue dark:text-apple-blue-dark">
                  {exp.period}
                </span>
              </div>
            </div>

            <ul className="mt-5 space-y-2.5 text-[15px] sm:text-[16px] leading-[1.5] text-gray-700 dark:text-gray-300">
              {exp.highlights.map((point, pIdx) => (
                <li key={pIdx} className="flex items-start space-x-2">
                  <span className="text-apple-blue font-bold text-lg leading-none mt-0.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkExperience;
