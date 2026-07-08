"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import AIBlob from "./ai-blob";

const highlights = [
  {
    label: "求职方向",
    value: "AI Agent / RAG 应用开发 / 自动化工作流",
  },
  {
    label: "教育背景",
    value: "武夷学院 通信工程本科 2022 - 2026",
  },
  {
    label: "核心能力",
    value: "Python、LangGraph、Hybrid RAG、FastAPI、Streamlit",
  },
];

const aboutBlobColors = ["#c4b5fd", "#7dd3fc", "#6366f1", "#22d3ee"];

export function BriefSection(): ReactNode {
  return (
    <section
      id="about"
      className="px-4 pt-20 pb-0 sm:px-6 md:pt-28 md:pb-0 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-foreground max-w-3xl text-2xl leading-tight font-medium sm:text-3xl md:text-4xl">
            我希望把大模型、自动化流程和真实业务问题连起来，做能真正提高效率、
            有数据依据、可复测、也能持续迭代的应用。
          </p>
          <div className="-mt-[30px] flex max-w-3xl justify-center">
            <AIBlob
              size={619}
              animationSpeed={0.72}
              colors={aboutBlobColors}
              glowIntensity={0.68}
              innerScale={1.35}
              noiseScale={3.4}
              resolution={0.78}
              className="opacity-92 drop-shadow-[0_0_52px_rgba(125,211,252,0.16)]"
            />
          </div>
        </motion.div>

        <motion.div
          className="grid content-start gap-4 self-start"
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
              className="h-[200px] rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-5 backdrop-blur-sm"
            >
              <p className="text-foreground/45 text-sm">{item.label}</p>
              <p className="text-foreground/88 mt-2 text-lg leading-snug">
                {item.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
