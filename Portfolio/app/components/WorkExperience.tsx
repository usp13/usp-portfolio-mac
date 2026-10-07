import React from "react";
import {
  FileText,
  ExternalLink,
  Github,
  Zap,
  Layers,
  Cpu,
  ShieldCheck,
  Database,
} from "lucide-react";

const WorkExperience: React.FC = () => {
  const kpis = [
    {
      metric: "140+",
      label: "Fields Extracted",
      sub: "Across Invoices, Packing Lists & Bills of Lading",
    },
    {
      metric: "<30s",
      label: "Processing Turnaround",
      sub: "Reduced from 30–60 min manual entry (98% faster)",
    },
    {
      metric: "99.2%",
      label: "Field Accuracy",
      sub: "Automated HS Code classification & validation",
    },
    {
      metric: "100%",
      label: "Audit-Ready Formats",
      sub: "Standardized JSON, Excel & customs-ready EDI",
    },
  ];

  const architecturalPillars = [
    {
      title: "Document AI & Spatial OCR Extraction Pipeline",
      icon: <Cpu className="w-5 h-5 text-apple-blue" />,
      points: [
        "Architected an enterprise document extraction pipeline capable of parsing 140+ structured and semi-structured fields from complex, heterogeneous international trade documents (Commercial Invoices, Packing Lists, Bills of Lading, and Shipping Bills).",
        "Engineered robust computer vision and spatial OCR heuristics that handle multi-page PDFs, noisy scans, skewed orientations, and varying invoice templates across diverse global shipping carriers.",
        "Integrated automated Harmonized System (HS) code classification and tariff category verification, cross-referencing descriptions against global trade schedules to streamline customs clearance.",
      ],
    },
    {
      title: "Interactive Split-Screen Human-in-the-Loop Workspace",
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
      points: [
        "Built a dual-pane interactive review interface in Next.js 15 and TypeScript, enabling customs operators to visually inspect the original uploaded document side-by-side with extracted data fields.",
        "Implemented real-time synchronized bounding box overlays linking form fields directly to document coordinates, enabling one-click visual verification and rapid point-and-click corrections.",
        "Engineered confidence scoring indicators across every extracted entity, automatically flagging low-certainty entries for human review while expediting straight-through processing for high-confidence data.",
      ],
    },
    {
      title: "Cross-Document Reconciliation & Compliance Validation",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      points: [
        "Implemented intelligent cross-document reconciliation algorithms that automatically verify consistency between Commercial Invoices and Packing Lists (e.g., matching net vs. gross weights, package counts, currency conversions, Incoterms, and total valuations).",
        "Created an automated discrepancy detection engine that flags conflicting quantities, missing mandatory statutory declarations, or tariff mismatches prior to filing.",
        "Significantly eliminated customs clearance rejections, demurrage penalties, and administrative turnaround delays for freight forwarding teams.",
      ],
    },
    {
      title: "High-Throughput Asynchronous Processing & Multi-Format Exports",
      icon: <Database className="w-5 h-5 text-amber-500" />,
      points: [
        "Designed asynchronous event-driven background processing queues to handle heavy multi-page PDF batch uploads reliably without blocking user interactions or timing out HTTP connections.",
        "Developed comprehensive export modules transforming normalized schemas into structured multi-tab Excel (XLSX) workbooks, clean JSON payloads, and customs portal EDI-compliant formats.",
        "Enforced secure, ephemeral file processing practices ensuring sensitive commercial pricing, supplier details, and proprietary trade documentation remain secure.",
      ],
    },
  ];

  const techStack = [
    "Next.js 15",
    "React 19",
    "TypeScript",
    "Document AI",
    "Computer Vision & OCR",
    "Node.js",
    "Python",
    "Tailwind CSS",
    "RESTful APIs",
    "Data Normalization",
    "Excel / EDI Pipeline",
    "Spatial Layout Analysis",
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-apple-blue">
          Work Experience
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-apple-display text-apple-ink dark:text-white">
          QuickCL — Customs AI & Document Automation
        </h1>
        <p className="text-[17px] text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Full-Stack AI Software Engineer spearheading automated document intelligence, spatial OCR pipelines, and cross-border trade compliance systems.
        </p>
      </div>

      {/* Main Experience Hero Card */}
      <div className="bg-white dark:bg-apple-tile-1 border border-apple-hairline dark:border-white/10 rounded-apple-card p-6 sm:p-8 shadow-apple-card transition-all">
        {/* Role & Company Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-apple-hairline dark:border-white/10 gap-4">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl font-semibold text-apple-ink dark:text-white tracking-tight">
                  QuickCL
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Production Platform
                </span>
              </div>
              <p className="text-base text-gray-700 dark:text-gray-300 font-medium mt-0.5">
                Full-Stack AI Software Engineer
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Customs Compliance Automation & AI Entity Extraction Platform
              </p>
            </div>
          </div>

          {/* Action Links & Timeline */}
          <div className="flex flex-wrap items-center gap-2.5 sm:self-start lg:self-center">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-apple-blue/10 text-apple-blue dark:text-apple-blue-dark">
              2025 – Present
            </span>
            <a
              href="https://quickcl.mapsai.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full bg-apple-blue hover:bg-apple-blue-focus text-white transition-all shadow-sm"
            >
              <span>Live Platform</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com/usp13/QuickCL"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full bg-apple-parchment dark:bg-apple-tile-2 hover:bg-gray-200 dark:hover:bg-white/10 text-apple-ink dark:text-white border border-apple-hairline dark:border-white/10 transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Repository</span>
            </a>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 my-6">
          {kpis.map((kpi, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-apple-parchment/60 dark:bg-apple-tile-2/60 border border-apple-hairline dark:border-white/5 flex flex-col justify-between"
            >
              <div className="text-2xl sm:text-3xl font-bold text-apple-blue tracking-tight">
                {kpi.metric}
              </div>
              <div className="mt-1">
                <div className="text-xs font-semibold text-apple-ink dark:text-white">
                  {kpi.label}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug mt-0.5">
                  {kpi.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Narrative */}
        <div className="p-4 sm:p-5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-[15px] sm:text-[15.5px] leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            At <strong className="text-apple-ink dark:text-white font-semibold">QuickCL</strong>, I led the core design and implementation of an end-to-end AI document extraction and trade compliance engine. The platform automates what previously required hours of tedious manual data entry for customs brokers and freight forwarders, slashing processing time from up to an hour down to under 30 seconds while eliminating high-cost filing errors.
          </p>
        </div>

        {/* Deep Dive Pillars */}
        <div className="mt-8 space-y-6">
          <h3 className="text-lg font-semibold text-apple-ink dark:text-white tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-apple-blue" />
            Engineering & Architectural Contributions
          </h3>

          <div className="grid grid-cols-1 gap-5">
            {architecturalPillars.map((pillar, pIdx) => (
              <div
                key={pIdx}
                className="p-5 rounded-2xl bg-white dark:bg-apple-tile-2/40 border border-apple-hairline dark:border-white/10 hover:border-apple-blue/30 transition-all space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-apple-parchment dark:bg-apple-tile-2 flex items-center justify-center shadow-xs">
                    {pillar.icon}
                  </div>
                  <h4 className="text-base font-semibold text-apple-ink dark:text-white">
                    {pillar.title}
                  </h4>
                </div>

                <ul className="space-y-2 text-[14.5px] sm:text-[15px] text-gray-700 dark:text-gray-300 leading-normal pl-1">
                  {pillar.points.map((pt, ptIdx) => (
                    <li key={ptIdx} className="flex items-start space-x-2.5">
                      <span className="text-apple-blue font-bold text-base leading-none mt-1">
                        •
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="mt-8 pt-6 border-t border-apple-hairline dark:border-white/10">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Core Technologies & Domain Tooling
          </h4>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, tIdx) => (
              <span
                key={tIdx}
                className="text-xs font-medium px-3 py-1 rounded-full bg-apple-parchment dark:bg-apple-tile-2 text-apple-ink dark:text-gray-200 border border-apple-hairline dark:border-white/5"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkExperience;
