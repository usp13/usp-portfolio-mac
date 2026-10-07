"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { getRandomPhilosophicalQuote } from "../data/quotes";

interface CommandItem {
  cmd: string;
  desc: string;
}

const COMMAND_LIST: CommandItem[] = [
  { cmd: "help", desc: "List all available terminal commands" },
  { cmd: "about", desc: "Display full developer biography & role" },
  { cmd: "skills", desc: "List technical stack, languages & frameworks" },
  { cmd: "projects", desc: "Explore featured engineering projects" },
  { cmd: "experience", desc: "View professional work experience" },
  { cmd: "education", desc: "Academic background and degrees" },
  { cmd: "resume", desc: "Overview of professional qualifications & CV" },
  { cmd: "contact", desc: "Reach out via Email, LinkedIn, GitHub, or X" },
  { cmd: "whoami", desc: "Print current active user identity" },
  { cmd: "neofetch", desc: "Display macOS system info & ASCII art" },
  { cmd: "ls", desc: "List directory files and folders" },
  { cmd: "pwd", desc: "Print current working directory" },
  { cmd: "cat <file>", desc: "Read content of a file (e.g. cat bio.txt)" },
  { cmd: "date", desc: "Display current date and local time" },
  { cmd: "echo <text>", desc: "Print arguments to terminal" },
  { cmd: "toggletheme", desc: "Switch between dark and light themes" },
  { cmd: "history", desc: "Show recent executed command history" },
  { cmd: "clear", desc: "Clear the terminal screen" },
  { cmd: "game", desc: "Play the interactive number guessing game" },
  { cmd: "quote", desc: "Get an inspiring philosophical quote (Stoicism, Plato, Machiavelli, etc.)" },
  { cmd: "sudo", desc: "Try running a command as superuser" },
];



const fileSystem: Record<string, string> = {
  "bio.txt": "Utsav Shailesh Panchal\nFull-Stack Developer & AI Systems Engineer based in India.\nSpecializing in high-performance web applications, LLM agent architectures, and RAG pipelines.",
  "skills.txt": "Core: TypeScript, C++, Python, Next.js, Node.js, React, TailwindCSS, MongoDB, PostgreSQL, Vector DBs, Docker, Linux.",
  "projects.txt": "1. InterReview — AI Mock Interview & Evaluation Engine\n2. Build-Your-Own RAG — Vector embedding search & augmentation engine\n3. QuickCL Customs — Automated 140+ field customs logistics pipeline (https://www.quickcl.mapsai.in)\n4. DND Alert Engine — High-throughput asynchronous alert dispatching and notification router",
  "contact.txt": "Email: utsavpanchal1304@gmail.com\nGitHub: https://github.com/usp13\nLinkedIn: https://linkedin.com/in/utsav-panchal\nX: https://x.com/theutsavpanchal",
  "resume.pdf": "[Binary File] Resume of Utsav Shailesh Panchal. Use the 'resume' command or click the Resume icon on the Desktop.",
};

const Terminal: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<(string | React.ReactNode)[]>([
    "Welcome to the portfolio terminal!",
    'Type "help" for a list of commands.',
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Number guessing game state
  const [gameStarted, setGameStarted] = useState(false);
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);

  const { theme, toggleTheme } = useTheme();
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  const startGame = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(randomNumber);
    setAttempts(0);
    setGameStarted(true);
  };

  const clearTerminal = () => {
    setOutput([
      "Welcome to the portfolio terminal!",
      'Type "help" for a list of commands.',
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Arrow Up: Previous command
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
    }
    // Arrow Down: Next command
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    }
    // Tab Auto-complete
    else if (e.key === "Tab") {
      e.preventDefault();
      const current = input.trim().toLowerCase();
      if (!current) return;
      const matched = COMMAND_LIST.find((c) => c.cmd.startsWith(current));
      if (matched) {
        setInput(matched.cmd);
      }
    }
    // Execute Command
    else if (e.key === "Enter") {
      executeCommand();
    }
  };

  const executeCommand = () => {
    const rawInput = input.trim();
    if (!rawInput) return;

    // Append to history
    setHistory((prev) => [...prev, rawInput]);
    setHistoryIndex(-1);

    const parts = rawInput.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    let response: string | React.ReactNode = "";

    // Handle game input if active
    if (gameStarted && !isNaN(Number(rawInput))) {
      const guess = Number(rawInput);
      setAttempts((prev) => prev + 1);

      if (guess < targetNumber!) {
        response = "Too low! Try again.";
      } else if (guess > targetNumber!) {
        response = "Too high! Try again.";
      } else {
        response = `Correct! You guessed the number in ${attempts + 1} attempts. Congo U can Guess it in log(100) complexity every time with the help of Binary Search. Type "game" to play again.`;
        setGameStarted(false);
        setTargetNumber(null);
      }
    } else {
      switch (command) {
        case "help":
          response = (
            <div className="space-y-1 my-1">
              <div className="font-bold underline">Available commands:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
                {COMMAND_LIST.map((item) => (
                  <div key={item.cmd}>
                    <span className="font-bold">{item.cmd}</span> &mdash; {item.desc}
                  </div>
                ))}
              </div>
            </div>
          );
          break;

        case "about":
        case "bio":
          response = `Utsav Shailesh Panchal — Full-Stack Developer & AI Systems Engineer.
Specializing in Generative AI, RAG pipelines, modern web applications (Next.js/MERN),
and high-performance systems in C++ and TypeScript.
Location: Ahmedabad / Bengaluru, India.`;
          break;

        case "skills":
        case "stack":
          response = `
  → Languages: JavaScript (ES6+), TypeScript, C++, Python, HTML5, CSS3, SQL
  → Frameworks: React.js, Next.js, Node.js, Express.js, TailwindCSS, MERN Stack
  → AI & Systems: Retrieval-Augmented Generation (RAG), Gemini AI, Vector Search, Distributed Microservices
  → Tools & DevOps: Git/GitHub, Docker, Linux, REST APIs, Vercel
  → Databases: MongoDB, PostgreSQL, Vector Databases
          `;
          break;

        case "projects":
          response = `
Featured Production Projects:
1. InterReview — AI Mock Interview & Evaluation Engine powered by LLMs and speech scoring.
2. Build-Your-Own RAG — Vector embedding search & augmentation engine with cosine similarity.
3. QuickCL Customs Intelligence — Automated customs logistics extraction pipeline processing 140+ fields (https://www.quickcl.mapsai.in).
4. DND Alert Engine — High-throughput asynchronous alert dispatching and notification router in TypeScript.
          `;
          break;

        case "experience":
        case "work":
          response = `
Work Experience — QuickCL (Customs AI & Document Automation):
Role: Full-Stack AI Software Engineer (2025 – Present)
Platform: https://www.quickcl.mapsai.in | Repo: https://github.com/usp13/QuickCL

Highlights & Contributions:
• Document AI Pipeline: Engineered end-to-end OCR and layout-aware entity extraction parsing 140+ fields from Invoices, Packing Lists & Bills of Lading.
• Turnaround Acceleration: Slashed processing cycle times from 30–60 minutes down to <30 seconds (98% reduction) with automated HS code classification.
• Human-in-the-Loop Workspace: Built interactive dual-pane review workspace in Next.js with synchronized bounding-box overlays and confidence scoring indicators.
• Reconciliation & Compliance: Developed automated cross-document validation comparing weights, packages, and values between Invoices and Packing Lists.
• Export Engine: Standardized exports into multi-tab Excel workbooks, normalized JSON schemas, and ICEGATE/EDI customs filings.
          `;
          break;

        case "education":
          response = `
Education:
Bachelor of Technology (B.Tech) in Computer Engineering.
Coursework: Data Structures & Algorithms, Operating Systems, DBMS, Computer Networks, OOP, AI/ML.
          `;
          break;

        case "contact":
          response = `Email: utsavpanchal1304@gmail.com | GitHub: github.com/usp13 | LinkedIn: linkedin.com/in/utsav-panchal | X: x.com/theutsavpanchal`;
          break;

        case "resume":
        case "cv":
          response = `Utsav Shailesh Panchal — Full-Stack & Systems Engineer Resume.
You can view or download the complete interactive resume by clicking the "Resume" icon on the Desktop or Dock.`;
          break;

        case "whoami":
          response = "utsav@macos-portfolio — Full-Stack Developer & AI Systems Engineer";
          break;

        case "neofetch":
        case "fastfetch":
          response = (
            <pre className="font-mono text-xs whitespace-pre leading-tight my-1">
{`
                    'c.          utsav@macbook-pro
                 ,xNMM.          ------------------
               .OMMMMo           OS: macOS Sonoma (Portfolio Edition)
               OMMM0,            Host: MacBook Pro (Apple M3 Max)
     .;loddo:' loolloddol;.      Kernel: 23.4.0 Darwin
   cKMMMMMMMMMMNWMMMMMMMMMM0:    Uptime: Live Portfolio Session
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.    Shell: zsh 5.9
 XMMMMMMMMMMMMMMMMMMMMMMMX.      Terminal: macOS Portfolio Terminal
;MMMMMMMMMMMMMMMMMMMMMMMM:       Theme: ${theme === "dark" ? "Dark Mode" : "Light Mode"}
:MMMMMMMMMMMMMMMMMMMMMMMM:       Stack: Next.js 15, React 19, TypeScript
.MMMMMMMMMMMMMMMMMMMMMMMX.       Memory: 36 GB Unified Memory
 kMMMMMMMMMMMMMMMMMMMMMMWd.
  'XMMMMMMMMMMMMMMMMMMMMMMk.
   .XMMMMMMMMMMMMMMMMMMMMK.
     kMMMMMMMMMMMMMMMMMMd.
      ;KMMMMMMMWXXWMMMMk.
        .cooc,.    .,cooc.
`}
            </pre>
          );
          break;

        case "ls":
          response = "about/   projects/   skills/   experience/   bio.txt   skills.txt   projects.txt   contact.txt   resume.pdf";
          break;

        case "pwd":
          response = "/Users/utsav/portfolio";
          break;

        case "cat":
          if (!args) {
            response = "Usage: cat <filename> (e.g. cat bio.txt, cat skills.txt)";
          } else if (fileSystem[args]) {
            response = fileSystem[args];
          } else {
            response = `cat: ${args}: No such file or directory`;
          }
          break;

        case "date":
          response = new Date().toString();
          break;

        case "echo":
          response = args || "";
          break;

        case "quote":
        case "motto": {
          const q = getRandomPhilosophicalQuote();
          response = (
            <div className="space-y-1 my-1">
              <p className="text-gray-100 italic">&ldquo;{q.quote}&rdquo;</p>
              <p className="text-apple-blue font-semibold text-xs">
                — {q.author} <span className="text-gray-400 font-normal">({q.source} • {q.school})</span>
              </p>
            </div>
          );
          break;
        }

        case "toggletheme":
        case "theme":
          toggleTheme();
          response = `Theme toggled to ${theme === "dark" ? "light" : "dark"}.`;
          break;

        case "sudo":
          response = "Permission denied: Utsav is the root administrator 🧙‍♂️. This incident has been logged.";
          break;

        case "history":
          response = history.map((cmd, i) => `${i + 1}  ${cmd}`).join("\n");
          break;

        case "game":
          if (!gameStarted) {
            startGame();
            response = "Welcome to the number guessing game! I have chosen a number between 1 and 100. Try to guess it!";
          } else {
            response = "You are already in a game! Make a guess.";
          }
          break;

        case "clear":
        case "cls":
          clearTerminal();
          setInput("");
          return;

        default:
          response = `Command not recognized: ${command}. Type "help" for a list of commands.`;
      }
    }

    if (response) {
      setOutput((prev) => [...prev, `$ ${rawInput}`, response]);
    } else {
      setOutput((prev) => [...prev, `$ ${rawInput}`]);
    }

    setInput("");
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="bg-inherit dark:text-green-400 text-black p-2 sm:p-4 rounded-lg shadow-lg w-full h-full font-mono text-xs sm:text-sm overflow-hidden flex flex-col cursor-text"
    >
      <div className="flex-1 overflow-y-auto mb-2 space-y-1">
        {output.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap leading-relaxed">
            {line}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      <div className="flex items-center">
        <span className="mr-2 font-bold">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none flex-1 text-inherit font-mono"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default Terminal;
