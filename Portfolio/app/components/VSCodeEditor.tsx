import React, { useState } from "react";
import {
  FileCode,
  FileText,
  FileJson,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Plus,
  GitBranch,
  CheckCheck,
  Code2,
  Terminal as TerminalIcon,
  X,
} from "lucide-react";

interface FileData {
  name: string;
  language: string;
  content: string;
}

interface Project {
  label: string;
  badgeColor: string;
  files: FileData[];
}

interface ProjectFiles {
  [key: string]: Project;
}

interface ExpandedState {
  [key: string]: boolean;
}

const initialProjects: ProjectFiles = {
  "utsav-profile": {
    label: "utsav-profile",
    badgeColor: "#3b82f6",
    files: [
      {
        name: "developer.json",
        language: "JSON",
        content: `{
  "name": "Utsav Shailesh Panchal",
  "title": "Full-Stack Developer & AI Systems Engineer",
  "location": "India",
  "contact": {
    "email": "utsavpanchal1304@gmail.com",
    "github": "https://github.com/usp13",
    "twitter": "https://x.com/theutsavpanchal"
  },
  "domains": [
    "Generative AI & LLM Systems",
    "Retrieval-Augmented Generation (RAG)",
    "Full-Stack Web Architectures",
    "Asynchronous Event-Driven Systems",
    "Automated Document Processing (OCR)"
  ],
  "experience": [
    {
      "role": "Full-Stack AI Software Engineer",
      "company": "QuickCL",
      "platform": "https://quickcl.mapsai.in",
      "repo": "https://github.com/usp13/QuickCL",
      "period": "2025 – Present",
      "highlights": [
        "140+ fields extracted across Invoices, Packing Lists & Bills of Lading",
        "Turnaround reduced from 30–60 minutes down to <30 seconds (98% reduction)",
        "Interactive dual-pane Next.js verification workspace with live bounding boxes",
        "Automated cross-document reconciliation & standardized Excel/EDI exports"
      ]
    }
  ],
  "status": "Available for high-impact software engineering & AI roles"
}`,
      },
      {
        name: "skills.ts",
        language: "TypeScript",
        content: `export interface DeveloperSkills {
  languages: string[];
  frameworks: string[];
  aiAndML: string[];
  databases: string[];
  devopsAndCloud: string[];
}

export const utsavSkills: DeveloperSkills = {
  languages: [
    "TypeScript",
    "JavaScript",
    "C++",
    "Python",
    "Go",
    "SQL",
    "HTML5/CSS3"
  ],
  frameworks: [
    "Next.js 15 (App Router)",
    "React 19",
    "Node.js",
    "Express.js",
    "Tailwind CSS",
    "FastAPI"
  ],
  aiAndML: [
    "Google Gemini 1.5 Pro / Flash",
    "LangChain / LlamaIndex",
    "Vector Embeddings & Semantic Search",
    "RAG Architecture from Scratch",
    "OCR & Document Intelligence",
    "Prompt Engineering & Fine-Tuning"
  ],
  databases: [
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Pinecone / ChromaDB",
    "SQLite"
  ],
  devopsAndCloud: [
    "Docker",
    "AWS",
    "Vercel",
    "Git & GitHub Actions",
    "Linux Systems Administration"
  ]
};

export function getProfileSummary(): string {
  return \`\${utsavSkills.languages.length} Languages, \${utsavSkills.frameworks.length} Frameworks, and deep AI/Systems expertise.\`;
}`,
      },
      {
        name: "biography.md",
        language: "Markdown",
        content: `# Utsav Shailesh Panchal
> Full-Stack Developer & AI Systems Engineer · India

## 🚀 About Me
Passionate software engineer focused on building robust full-stack applications, intelligent Generative AI & RAG pipelines, and high-throughput systems. Experienced in creating AI-driven developer tooling, asynchronous notification routers, automated document extraction platforms, and modern web architectures.

## 💼 Core Focus Areas
- **Generative AI & RAG**: Built first-principles RAG engines without black-box abstractions, including custom chunking, dense vector similarity, and contextual re-ranking.
- **Full-Stack Engineering**: Production experience building end-to-end platforms using Next.js, React, Node.js, Express, and distributed databases.
- **Enterprise Automation**: Engineered OCR pipelines extracting 140+ fields from complex international logistics documents in under 30 seconds.
- **Systems & Performance**: Event-driven asynchronous notification routers with priority queues and low-latency algorithmic utilities in C++.

## 📬 Contact Information
- **Email**: utsavpanchal1304@gmail.com
- **GitHub**: https://github.com/usp13
- **Twitter/X**: https://x.com/theutsavpanchal`,
      },
    ],
  },
  "resumify-ai": {
    label: "resumify-ai",
    badgeColor: "#10b981",
    files: [
      {
        name: "geminiAnalyzer.ts",
        language: "TypeScript",
        content: `import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ATSScoreResult {
  matchScore: number;
  atsCompatibility: "High" | "Medium" | "Low";
  missingKeywords: string[];
  tailoredQuestions: string[];
  summary: string;
}

export async function analyzeResumeWithGemini(
  resumeText: string,
  targetJobDescription: string
): Promise<ATSScoreResult> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = \`
    Analyze the following resume against the job description for ATS compatibility:
    
    [RESUME]
    \${resumeText.slice(0, 3000)}
    
    [JOB DESCRIPTION]
    \${targetJobDescription.slice(0, 2000)}
    
    Return strict JSON with matchScore (0-100), atsCompatibility, missingKeywords,
    tailoredQuestions (5 technical questions), and executive summary.
  \`;

  const response = await model.generateContent(prompt);
  return JSON.parse(response.response.text());
}`,
      },
      {
        name: "mockInterviewScorer.py",
        language: "Python",
        content: `import numpy as np

class MockInterviewEvaluator:
    """Intelligent Mock Interview Evaluation Engine by Utsav Panchal"""
    def __init__(self, candidate_name: str = "Utsav Panchal"):
        self.candidate = candidate_name
        self.metrics = ["technical_accuracy", "communication_clarity", "depth_of_knowledge", "confidence"]
        
    def evaluate_response(self, question: str, response_text: str, duration_sec: int) -> dict:
        word_count = len(response_text.split())
        words_per_minute = (word_count / max(duration_sec, 1)) * 60
        
        # Heuristic scoring on technical correctness and pacing
        tech_score = min(100, int(90 + np.random.uniform(3, 9)))
        pacing_score = 96 if 125 <= words_per_minute <= 155 else 90
        overall = round((tech_score * 0.6) + (pacing_score * 0.4), 1)
        
        return {
            "candidate": self.candidate,
            "overall_score": overall,
            "words_per_minute": round(words_per_minute, 1),
            "feedback": "Articulate, structured explanation utilizing first-principles engineering reasoning.",
            "status": "STRONG HIRE / ADVANCE TO FINAL"
        }

if __name__ == "__main__":
    evaluator = MockInterviewEvaluator()
    result = evaluator.evaluate_response("Explain vector similarity in RAG", "...", 48)
    print(f"[InterReview] Evaluation for {result['candidate']}: {result['overall_score']}/100")`,
      },
    ],
  },
  "build-your-own-rag": {
    label: "build-your-own-rag",
    badgeColor: "#f59e0b",
    files: [
      {
        name: "rag_pipeline.py",
        language: "Python",
        content: `import math
from typing import List, Dict, Tuple

class DenseVectorStore:
    """First-Principles Retrieval-Augmented Generation implementation by Utsav Panchal"""
    def __init__(self):
        self.documents: List[str] = []
        self.embeddings: List[List[float]] = []

    @staticmethod
    def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
        dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a))
        norm_b = math.sqrt(sum(b * b for b in vec_b))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot_product / (norm_a * norm_b)

    def search_similar(self, query_vec: List[float], top_k: int = 3) -> List[Tuple[str, float]]:
        scores = [
            (doc, self.cosine_similarity(query_vec, emb))
            for doc, emb in zip(self.documents, self.embeddings)
        ]
        return sorted(scores, key=lambda x: x[1], reverse=True)[:top_k]

class RAGPipeline:
    def __init__(self, vector_store: DenseVectorStore):
        self.store = vector_store

    def query(self, user_prompt: str, prompt_embedding: List[float]) -> Dict:
        matched_chunks = self.store.search_similar(prompt_embedding, top_k=3)
        context = "\\n---\\n".join([chunk for chunk, _ in matched_chunks])
        
        augmented_prompt = f"""Use the following retrieved context to answer accurately:
Context:
{context}

Question: {user_prompt}
Answer:"""
        return {"augmented_prompt": augmented_prompt, "sources": len(matched_chunks)}`,
      },
      {
        name: "chunkingStrategy.ts",
        language: "TypeScript",
        content: `export interface DocumentChunk {
  id: string;
  text: string;
  tokenCount: number;
  metadata: {
    source: string;
    chunkIndex: number;
  };
}

export function recursiveChunkDocument(
  content: string,
  chunkSize: number = 512,
  overlap: number = 64
): DocumentChunk[] {
  const words = content.split(/\\s+/);
  const chunks: DocumentChunk[] = [];
  let index = 0;

  for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
    const slice = words.slice(i, i + chunkSize).join(" ");
    if (slice.trim().length > 0) {
      chunks.push({
        id: \`chunk-\${index}\`,
        text: slice,
        tokenCount: slice.split(/\\s+/).length,
        metadata: {
          source: "utsav-knowledge-base.md",
          chunkIndex: index++,
        }
      });
    }
  }

  return chunks;
}`,
      },
    ],
  },
  "dnd-alert-engine": {
    label: "dnd-alert-engine",
    badgeColor: "#ec4899",
    files: [
      {
        name: "alertRouter.ts",
        language: "TypeScript",
        content: `export interface AlertNotification {
  id: string;
  recipientId: string;
  priority: "CRITICAL" | "HIGH" | "STANDARD";
  channel: "SMS" | "EMAIL" | "PUSH" | "WEBHOOK";
  payload: Record<string, unknown>;
  createdAt: number;
}

export class DNDAlertEngine {
  private queue: AlertNotification[] = [];

  enqueueAlert(notification: AlertNotification): void {
    if (notification.priority === "CRITICAL") {
      this.queue.unshift(notification);
    } else {
      this.queue.push(notification);
    }
  }

  async dispatchNext(): Promise<boolean> {
    const alert = this.queue.shift();
    if (!alert) return false;

    console.log(\`[AlertEngine] Dispatching \${alert.priority} alert to \${alert.recipientId} via \${alert.channel}\`);
    return true;
  }
}`,
      },
      {
        name: "priorityQueue.ts",
        language: "TypeScript",
        content: `export class FastPriorityQueue<T> {
  private heap: { item: T; priority: number }[] = [];

  push(item: T, priority: number): void {
    this.heap.push({ item, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0].item;
    const bottom = this.heap.pop();
    if (this.heap.length > 0 && bottom) {
      this.heap[0] = bottom;
      this.sinkDown(0);
    }
    return top;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIdx = Math.floor((index - 1) / 2);
      if (this.heap[index].priority <= this.heap[parentIdx].priority) break;
      [this.heap[index], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[index]];
      index = parentIdx;
    }
  }

  private sinkDown(index: number): void {
    const length = this.heap.length;
    while (true) {
      let largest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < length && this.heap[left].priority > this.heap[largest].priority) largest = left;
      if (right < length && this.heap[right].priority > this.heap[largest].priority) largest = right;
      if (largest === index) break;

      [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
      index = largest;
    }
  }
}`,
      },
    ],
  },
  "quickcl-customs": {
    label: "quickcl-customs",
    badgeColor: "#8b5cf6",
    files: [
      {
        name: "customsExtractor.ts",
        language: "TypeScript",
        content: `export interface CustomsDeclarationField {
  hsCode: string;
  goodsDescription: string;
  grossWeightKg: number;
  invoiceValueUSD: number;
  countryOfOrigin: string;
  confidenceScore: number;
}

export class CustomsDocumentExtractor {
  static validateHsCode(hsCode: string): boolean {
    const hsRegex = /^[0-9]{4}\\.[0-9]{2}(\\.[0-9]{2})?$/;
    return hsRegex.test(hsCode.trim());
  }

  static parseInvoice(ocrText: string): CustomsDeclarationField[] {
    // Automated extraction of commercial invoice entities
    console.log(\`[QuickCL] Extracting 140+ fields from \${ocrText.length} characters of OCR buffer\`);
    return [
      {
        hsCode: "8471.30",
        goodsDescription: "High-Performance Computational Server Nodes",
        grossWeightKg: 1450.5,
        invoiceValueUSD: 84500.0,
        countryOfOrigin: "IN",
        confidenceScore: 0.994
      }
    ];
  }
}`,
      },
    ],
  },
};

const getFileIcon = (fileName: string) => {
  if (fileName.endsWith(".json")) return <FileJson className="w-3.5 h-3.5 text-amber-400" />;
  if (fileName.endsWith(".ts") || fileName.endsWith(".tsx")) return <FileCode className="w-3.5 h-3.5 text-blue-400" />;
  if (fileName.endsWith(".py")) return <Code2 className="w-3.5 h-3.5 text-emerald-400" />;
  if (fileName.endsWith(".cpp") || fileName.endsWith(".h")) return <FileCode className="w-3.5 h-3.5 text-purple-400" />;
  return <FileText className="w-3.5 h-3.5 text-sky-400" />;
};

const VSCodeEditor: React.FC = () => {
  const [projects, setProjects] = useState<ProjectFiles>(initialProjects);

  const [expandedProjects, setExpandedProjects] = useState<ExpandedState>({
    "utsav-profile": true,
    "resumify-ai": true,
    "build-your-own-rag": true,
    "dnd-alert-engine": false,
    "quickcl-customs": false,
  });

  const [selectedProject, setSelectedProject] = useState<string>("utsav-profile");
  const [selectedFile, setSelectedFile] = useState<FileData>(
    initialProjects["utsav-profile"].files[0]
  );

  const addNewFile = (projectName: string) => {
    const fileName = prompt("Enter file name (e.g., config.ts, test.py, notes.md):");
    if (fileName && fileName.trim()) {
      let lang = "Plain Text";
      if (fileName.endsWith(".ts")) lang = "TypeScript";
      else if (fileName.endsWith(".py")) lang = "Python";
      else if (fileName.endsWith(".cpp")) lang = "C++";
      else if (fileName.endsWith(".json")) lang = "JSON";
      else if (fileName.endsWith(".md")) lang = "Markdown";

      const newFile: FileData = {
        name: fileName.trim(),
        language: lang,
        content: `// Created by Utsav Panchal\n// File: ${fileName.trim()}\n\n`,
      };
      setProjects((prev) => ({
        ...prev,
        [projectName]: {
          ...prev[projectName],
          files: [...prev[projectName].files, newFile],
        },
      }));
      setSelectedProject(projectName);
      setSelectedFile(newFile);
    }
  };

  const lineCount = selectedFile.content.split("\n").length;

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] text-[#d4d4d4] font-sans select-none overflow-hidden text-xs sm:text-[13px]">
      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* VS Code Left Activity & Explorer Bar */}
        <div className="w-52 sm:w-60 border-r border-[#333333] bg-[#252526] flex flex-col shrink-0">
          {/* Explorer Header */}
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#858585] flex items-center justify-between border-b border-[#333333]">
            <span>Explorer: Utsav Workspace</span>
          </div>

          {/* Project Tree */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
            {Object.entries(projects).map(([projectKey, project]) => {
              const isExpanded = expandedProjects[projectKey];
              return (
                <div key={projectKey} className="rounded">
                  {/* Project Folder Row */}
                  <div className="flex items-center justify-between px-1.5 py-1 rounded hover:bg-[#2a2d2e] cursor-pointer group">
                    <div
                      className="flex items-center space-x-1.5 flex-1 min-w-0"
                      onClick={() =>
                        setExpandedProjects((prev) => ({
                          ...prev,
                          [projectKey]: !prev[projectKey],
                        }))
                      }
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-[#858585] shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-[#858585] shrink-0" />
                      )}
                      {isExpanded ? (
                        <FolderOpen
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: project.badgeColor }}
                        />
                      ) : (
                        <Folder
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: project.badgeColor }}
                        />
                      )}
                      <span className="font-medium text-[#cccccc] truncate text-xs">
                        {project.label}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addNewFile(projectKey);
                      }}
                      title="Add File"
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[#37373d] rounded text-[#cccccc] transition-opacity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Files inside project */}
                  {isExpanded && (
                    <div className="ml-3 pl-2 border-l border-[#3a3d41] mt-0.5 space-y-0.5">
                      {project.files.map((file) => {
                        const isSelected =
                          selectedProject === projectKey &&
                          selectedFile.name === file.name;
                        return (
                          <div
                            key={file.name}
                            onClick={() => {
                              setSelectedProject(projectKey);
                              setSelectedFile(file);
                            }}
                            className={`flex items-center space-x-2 px-2 py-1 rounded cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-[#37373d] text-white font-medium"
                                : "hover:bg-[#2a2d2e] text-[#cccccc]"
                            }`}
                          >
                            {getFileIcon(file.name)}
                            <span className="truncate text-xs">{file.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
          {/* Top File Tab Strip */}
          <div className="h-8 bg-[#252526] border-b border-[#333333] flex items-center px-1 overflow-x-auto">
            <div className="flex items-center space-x-2 bg-[#1e1e1e] border-t-2 border-apple-blue px-3 py-1.5 text-xs text-white">
              {getFileIcon(selectedFile.name)}
              <span className="font-mono text-xs">{selectedFile.name}</span>
              <button
                className="hover:bg-[#333333] p-0.5 rounded text-[#858585] hover:text-white"
                onClick={() => {}}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Breadcrumb Header */}
          <div className="px-3 py-1 bg-[#1e1e1e] text-[11px] text-[#858585] font-mono border-b border-[#282828] flex items-center space-x-1.5 select-none">
            <span>utsav-workspace</span>
            <span>&gt;</span>
            <span className="text-white/80">{selectedProject}</span>
            <span>&gt;</span>
            <span className="text-white">{selectedFile.name}</span>
          </div>

          {/* Code Body with Line Numbers & Editable Area */}
          <div className="flex-1 flex overflow-auto font-mono text-xs sm:text-[13px] bg-[#1e1e1e]">
            {/* Line Numbers */}
            <div className="py-3 px-2 sm:px-3 text-right text-[#858585]/60 bg-[#1e1e1e] select-none border-r border-[#2d2d2d] w-10 sm:w-12 shrink-0 leading-5">
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editable Code Buffer */}
            <textarea
              value={selectedFile.content}
              onChange={(e) => {
                const updatedFile = {
                  ...selectedFile,
                  content: e.target.value,
                };
                setProjects((prev) => ({
                  ...prev,
                  [selectedProject]: {
                    ...prev[selectedProject],
                    files: prev[selectedProject].files.map((f) =>
                      f.name === selectedFile.name ? updatedFile : f
                    ),
                  },
                }));
                setSelectedFile(updatedFile);
              }}
              className="p-3 flex-1 bg-transparent text-[#d4d4d4] font-mono leading-5 resize-none outline-none overflow-auto"
              spellCheck="false"
              style={{
                tabSize: 2,
              }}
            />
          </div>
        </div>
      </div>

      {/* VS Code Bottom Status Bar */}
      <div className="h-6 bg-apple-blue text-white px-3 flex items-center justify-between text-[11px] shrink-0 font-medium select-none">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <GitBranch className="w-3 h-3" />
            <span>main*</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCheck className="w-3 h-3" />
            <span>0 Errors</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1">
            <TerminalIcon className="w-3 h-3" />
            <span>Utsav Panchal Portfolio</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span>Ln {lineCount}, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span className="font-semibold">{selectedFile.language}</span>
        </div>
      </div>
    </div>
  );
};

export default VSCodeEditor;
