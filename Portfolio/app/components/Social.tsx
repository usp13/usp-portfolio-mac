import React from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ArrowUpRight,
} from "lucide-react";

const socialLinks = [
  {
    icon: <Github className="w-5 h-5" />,
    label: "GitHub",
    handle: "github.com/usp13",
    url: "https://github.com/usp13",
    description: "Explore repositories, RAG pipelines, and open-source contributions",
  },
  {
    icon: <Twitter className="w-5 h-5" />,
    label: "X (Twitter)",
    handle: "@theutsavpanchal",
    url: "https://x.com/theutsavpanchal",
    description: "Follow thoughts on AI engineering, systems, and tech",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    label: "Email",
    handle: "utsavpanchal1304@gmail.com",
    url: "mailto:utsavpanchal1304@gmail.com",
    description: "Direct inquiries, opportunities, and collaboration",
  },
  {
    icon: <Linkedin className="w-5 h-5" />,
    label: "LinkedIn",
    handle: "linkedin.com/in/utsav-panchal",
    url: "https://www.linkedin.com/in/utsav-panchal",
    description: "Professional network, experience, and endorsements",
  },
];

const ConnectWithMe: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 sm:p-10 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-apple-blue">
          Get in Touch
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-apple-display text-apple-ink dark:text-white">
          Connect With Me
        </h1>
        <p className="text-[17px] text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
          Reach out for collaborations, engineering roles, or tech discussions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target={link.url.startsWith("mailto:") ? undefined : "_blank"}
            rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            className="apple-press flex flex-col justify-between p-6 bg-white dark:bg-apple-tile-1 border border-apple-hairline dark:border-white/10 rounded-apple-card shadow-apple-card hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-full bg-apple-parchment dark:bg-apple-tile-2 text-apple-blue flex items-center justify-center transition-colors">
                {link.icon}
              </div>
              <div className="w-8 h-8 rounded-full bg-apple-parchment dark:bg-apple-tile-2 flex items-center justify-center text-gray-400 group-hover:text-apple-blue transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-5 space-y-1">
              <h3 className="text-lg font-semibold text-apple-ink dark:text-white">
                {link.label}
              </h3>
              <p className="text-sm font-medium text-apple-blue">
                {link.handle}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                {link.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ConnectWithMe;
