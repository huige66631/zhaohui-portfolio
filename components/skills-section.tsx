"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const skillGroups = [
  {
    title: "AI 应用与 Agent",
    items: [
      "LangGraph",
      "RAG",
      "Hybrid RAG",
      "Query Rewrite",
      "记忆增强",
      "Prompt 设计",
    ],
  },
  {
    title: "开发与工程实现",
    items: [
      "Python",
      "FastAPI",
      "Streamlit",
      "Java",
      "SQL",
      "Git",
      "Docker",
    ],
  },
  {
    title: "自动化与数据处理",
    items: [
      "n8n",
      "PowerShell",
      "Windows Scheduled Tasks",
      "Pandas",
      "NumPy",
      "Excel",
    ],
  },
  {
    title: "通信与仿真基础",
    items: [
      "OFDM",
      "QPSK / 16QAM",
      "PCM",
      "信道估计",
      "频域均衡",
      "MATLAB / Simulink",
    ],
  },
];

export function SkillsSection(): ReactNode {
  return (
    <section id="skills" className="px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-14 max-w-3xl"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-sm text-foreground/45">能力模块</p>
          <h2 className="mt-3 text-3xl leading-tight font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl">
            技术能力围绕应用开发、自动化与工程落地展开
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {skillGroups.map((group, index) => (
            <motion.article
              key={group.title}
              className="rounded-[30px] border border-white/10 bg-white/[0.025] p-6 md:p-7"
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{
                duration: 0.58,
                delay: index * 0.06,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <h3 className="text-xl font-medium text-foreground">{group.title}</h3>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-foreground/64"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
