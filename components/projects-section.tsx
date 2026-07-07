"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

const projects = [
  {
    title: "NetDiag Agent 本地网络诊断智能体",
    period: "2026.05 - 至今",
    role: "AI Agent 开发",
    focus: "本地探测 + 知识增强",
    summary:
      "面向个人网络排障场景，把分散的本地诊断命令整合为可交互、可解释的网络诊断 Agent。",
    challenge:
      "用户往往只能描述“网页很慢”或“某个网站打不开”，但问题背后可能涉及 DNS、网关、丢包或路径异常，手动排查门槛高。",
    stack: [
      "Python",
      "Streamlit",
      "LangGraph",
      "DeepSeek API",
      "ChromaDB",
      "RAG",
    ],
    contributions: [
      "基于 LangGraph 搭建工具调用式诊断流程，接入大模型做诊断规划与结果解释。",
      "封装网关、DNS、延迟、丢包、路由路径等多维检测工具，形成真实探测闭环。",
      "加入向量知识库、长期记忆与轻量 Query 改写，提升口语化问题下的诊断质量。",
    ],
    outcome:
      "实现真实探测、知识检索与记忆增强结合的诊断原型，提升个人网络问题定位效率与结果可解释性。",
    href: "https://github.com/huige66631/NetDiag-Agent",
  },
  {
    title: "企业知识助手 Agent",
    period: "2026.06 - 至今",
    role: "AI Agent / RAG 开发",
    focus: "企业知识问答 + 多轮追问",
    summary:
      "面向企业手册、FAQ、测试规范等资料场景，设计并实现可本地部署的企业知识助手，解决资料分散、人工检索效率低、答案难溯源以及多轮问答体验弱的问题。",
    challenge:
      "企业知识通常散落在手册、FAQ 与测试规范中，人工查询成本高，复杂 PDF 场景下召回不稳，且回答缺乏可引用、可追问与可追溯能力。",
    stack: [
      "Python",
      "FastAPI",
      "Streamlit",
      "LangGraph",
      "ChromaDB",
      "Hybrid RAG",
      "Query Rewrite",
      "SQLite",
      "Docker",
      "DeepSeek API",
    ],
    contributions: [
      "实现文档上传解析、切分、索引与问答全链路，完成资料入库、后端服务与前端交互闭环。",
      "构建关键词检索 + 向量检索 + RRF 融合的 Hybrid RAG，兼顾复杂文档场景下的召回效果与相关性。",
      "基于 LangGraph 设计 KB-first Agent 路由，并实现上下文感知 Query Rewrite、章节正文回填、引用溯源与 SQLite 会话记忆化。",
    ],
    outcome:
      "将传统人工翻阅手册、FAQ 和测试规范的查询流程收敛为可检索、可引用、可追问的知识问答流程；构建离线检索评测集并持续优化复杂 PDF 场景下的召回效果，在自建评测集上将 Recall@4 从 0.3125 提升至 0.5625，MRR@4 从 0.2292 提升至 0.4271，完成从资料入库到 Docker 部署的完整应用闭环。",
    href: "https://github.com/huige66631/Enterprise-Knowledge-Assistant",
  },
  {
    title: "AI 行业情报自动采集与知识蒸馏系统",
    period: "2026.06 - 至今",
    role: "自动化工作流",
    focus: "采集 - 蒸馏 - 沉淀",
    summary:
      "围绕 AI 行业资讯跟踪，搭建“自动采集 - 周级蒸馏 - 长期沉淀”的知识闭环系统。",
    challenge:
      "AI 行业更新快、来源分散、长期知识难沉淀，手工整理既耗时，也很难形成稳定的知识迭代机制。",
    stack: [
      "Obsidian",
      "Codex",
      "PowerShell",
      "Scheduled Tasks",
      "Markdown",
      "GitHub",
    ],
    contributions: [
      "搭建约 20 个资讯入口的采集链路，覆盖 GitHub、RSS、Hacker News、Reddit 等来源。",
      "通过 Codex 自动执行日报整理、周报蒸馏与长期知识回填，降低重复整理成本。",
      "结合 PowerShell 脚本与任务调度，完成发布、同步与本地知识库维护。",
    ],
    outcome:
      "打通日报采集、自动整理、周报生成与长期回填链路，预计每天节省 30 - 45 分钟整理时间。",
  },
  {
    title: "新闻聚合与智能推送工作流",
    period: "2026.03 - 2026.04",
    role: "n8n 自动化开发",
    focus: "资讯筛选 + 自动推送",
    summary:
      "为多平台新闻收集场景搭建自动化抓取、筛选、分类与推送工作流，减少人工重复操作。",
    challenge:
      "多平台新闻分散，人工收集和筛选效率低，难以持续稳定地获取高质量信息。",
    stack: ["n8n", "API 对接", "定时任务", "消息推送"],
    contributions: [
      "配置多源新闻抓取节点，实现资讯自动采集。",
      "搭建关键词过滤、去重、分类规则，对信息进行结构化筛选。",
      "完成定时触发与推送流程，减少人工重复操作。",
    ],
    outcome:
      "实现新闻从采集、清洗到推送的全流程自动化，提升信息获取效率与内容质量。",
  },
];

const signals = [
  { label: "项目方向", value: "Agent / RAG / 自动化" },
  { label: "表达重点", value: "问题定义 - 方法实现 - 结果价值" },
  { label: "偏好风格", value: "偏工程落地，强调结构与闭环" },
];

export function ProjectsSection(): ReactNode {
  return (
    <section
      id="projects"
      className="px-4 pt-0 pb-20 sm:px-6 md:pt-0 md:pb-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="grid gap-10 border-t border-white/8 pt-10 lg:grid-cols-[1fr_0.84fr] lg:items-end"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="max-w-3xl">
            <p className="text-foreground/42 text-sm">项目经历</p>
            <h2 className="text-foreground mt-3 text-3xl leading-tight font-medium tracking-tight sm:text-4xl md:text-5xl">
              用项目说明我如何拆问题、搭结构，并把事情真正做出来
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-2">
            {signals.map((item, index) => (
              <div
                key={item.label}
                className={`rounded-[24px] border border-white/10 bg-white/[0.025] px-4 py-4 ${
                  index === 2 ? "lg:col-span-2" : ""
                }`}
              >
                <p className="text-foreground/38 text-xs">{item.label}</p>
                <p className="text-foreground/72 mt-2 text-sm leading-6">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-10 grid gap-6">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] backdrop-blur-sm"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{
                duration: 0.58,
                delay: index * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="border-b border-white/8 p-6 md:p-8 lg:border-r lg:border-b-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-foreground/42 rounded-full border border-white/10 px-3 py-1 text-xs">
                      0{index + 1}
                    </span>
                    <span className="text-foreground/42 rounded-full border border-white/10 px-3 py-1 text-xs">
                      {project.role}
                    </span>
                    <span className="text-foreground/42 rounded-full border border-white/10 px-3 py-1 text-xs">
                      {project.focus}
                    </span>
                  </div>

                  <div className="mt-6 flex flex-wrap items-start gap-3">
                    <h3 className="text-foreground max-w-2xl text-2xl leading-tight font-medium tracking-tight md:text-[2rem]">
                      {project.title}
                    </h3>
                    <span className="text-foreground/44 rounded-full border border-white/10 px-3 py-1 text-xs">
                      {project.period}
                    </span>
                  </div>

                  <p className="text-foreground/68 mt-5 max-w-2xl text-base leading-8">
                    {project.summary}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="text-foreground/62 rounded-full bg-white/[0.06] px-3 py-1.5 text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {project.href ? (
                    <Link
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-8 inline-flex items-center gap-2 text-sm text-sky-200/86 transition-colors hover:text-sky-100"
                    >
                      查看项目仓库
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>

                <div className="grid gap-0">
                  <div className="border-b border-white/8 p-6 md:p-8">
                    <p className="text-foreground/38 text-xs">项目背景</p>
                    <p className="text-foreground/66 mt-3 max-w-2xl text-sm leading-7">
                      {project.challenge}
                    </p>
                  </div>

                  <div className="border-b border-white/8 p-6 md:p-8">
                    <p className="text-foreground/38 text-xs">关键实现</p>
                    <ul className="mt-3 grid gap-3">
                      {project.contributions.map((item) => (
                        <li
                          key={item}
                          className="text-foreground/66 text-sm leading-7"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[radial-gradient(circle_at_top_left,rgba(124,136,255,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-6 md:p-8">
                    <p className="text-foreground/38 text-xs">结果与价值</p>
                    <p className="text-foreground/74 mt-3 max-w-2xl text-sm leading-7">
                      {project.outcome}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
