"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const highlights = [
  {
    label: "求职方向",
    value: "AI 应用开发 / Agent / 智能自动化",
  },
  {
    label: "教育背景",
    value: "武夷学院 通信工程本科 2022 - 2026",
  },
  {
    label: "核心能力",
    value: "Python、LangGraph、RAG、n8n、Streamlit",
  },
];

export function BriefSection(): ReactNode {
  return (
    <section id="about" className="px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="max-w-3xl text-2xl leading-tight font-medium text-foreground sm:text-3xl md:text-4xl">
            我希望把大模型、自动化流程和真实业务问题连起来，做能真正提高效率、
            能被使用、也能持续迭代的应用。
          </p>
        </motion.div>

        <motion.div
          className="grid gap-4"
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{
            duration: 0.6,
            delay: 0.08,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-5 backdrop-blur-sm"
            >
              <p className="text-sm text-foreground/45">{item.label}</p>
              <p className="mt-2 text-lg leading-snug text-foreground/88">
                {item.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
