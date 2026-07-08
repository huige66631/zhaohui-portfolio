"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const works = [
  {
    title: "Agent 工作流设计",
    description:
      "能够围绕真实问题设计工具调用、规则诊断、记忆、知识检索与结果解释链路，而不是只停留在模型调用层。",
  },
  {
    title: "自动化系统落地",
    description:
      "擅长把日常重复流程拆解成可执行步骤，用 n8n、Codex、脚本和定时任务做成可运行系统。",
  },
  {
    title: "通信背景 + AI 应用结合",
    description:
      "既有通信工程的建模与分析基础，也在持续做 AI 应用侧的工程实现，适合偏技术落地的岗位。",
  },
];

export function WorksSection(): ReactNode {
  return (
    <section id="works" className="px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="max-w-3xl">
            <p className="text-sm text-foreground/45">作品 / 风格</p>
            <h2 className="mt-3 text-3xl leading-tight font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl">
              我更偏向做有清晰问题、有真实输入输出链路的应用
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-7 text-foreground/58">
            目前的项目大多围绕本地诊断、知识问答、自动化采集、行业信息处理这些场景展开。相比纯概念展示，我更希望作品能体现结构化思考、数据依据和落地能力。
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {works.map((work, index) => (
            <motion.article
              key={work.title}
              className="min-h-[240px] rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6"
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{
                duration: 0.58,
                delay: index * 0.06,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div className="flex h-full flex-col justify-between">
                <span className="text-sm text-foreground/38">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-2xl font-medium tracking-tight text-foreground">
                    {work.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-foreground/62">
                    {work.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
