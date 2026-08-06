"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

const projects = [
  {
    title: "NetDiag Agent 本地网络诊断智能体",
    period: "2026.05 - 至今",
    role: "AI Agent 开发工程师",
    focus: "本地诊断 + 半自动修复",
    summary:
      "面向网页访问慢、DNS 异常、单站点打不开、游戏卡顿等个人网络故障场景，将网络探测、规则判断、修复建议与复测流程整合为可交互诊断系统。",
    challenge:
      "个人用户排障时往往需要手动执行 ping、nslookup、tracert 等命令，问题可能涉及 DNS、网关、链路质量、端口可达性或代理配置，定位门槛高且复测流程分散。",
    stack: [
      "Python",
      "Streamlit",
      "LangGraph",
      "DeepSeek API",
      "ChromaDB",
      "RAG",
      "Windows 网络命令",
      "pytest",
    ],
    contributions: [
      "基于 LangGraph 串联症状输入、探测规划、工具调用、规则诊断、结果解释、修复建议与复测流程。",
      "封装 DNS、Ping、Tracert、TCP 端口、HTTP 访问、ipconfig/netsh 等检测能力，覆盖网关、链路质量、单站点访问和端口可达性。",
      "构建问题分类规则和 9 项健康评分指标，输出问题类型、风险等级、置信度、原因解释和数据依据。",
      "实现半自动修复闭环：对 DNS 缓存刷新、代理重置、DHCP 续租等低/中风险动作提供安全白名单执行，高风险操作仅给出人工确认建议，修复后自动复测。",
    ],
    outcome:
      "覆盖 6 类常见个人网络故障场景，将多条命令排查流程整合为一次点击式诊断与复测；典型排障时间由约 10-30 分钟压缩至 1-3 分钟，并完成 5 类故障注入演示场景、26 条核心单元测试与 Markdown/JSON 报告导出。",
    href: "https://github.com/huige66631/NetDiag-Agent",
  },
  {
    title: "Tryrevive 注意力守护与 AI 行动规划平台",
    period: "2026.06 - 至今",
    role: "AI 产品 / 全栈开发",
    focus: "目标拆解 + 跨站回流",
    summary:
      "面向容易被推荐流和娱乐网站带走注意力的用户，设计并实现“目标拆解、限时浏览、到点回流、继续行动”的注意力管理平台。",
    challenge:
      "传统专注工具通常只能限制访问，难以理解用户当下目标，也无法在用户进入内容平台后维持计划上下文并推动下一步行动。",
    stack: [
      "JavaScript",
      "HTML / CSS",
      "Chrome Extension MV3",
      "DeepSeek API",
      "Cloudflare Workers",
      "腾讯云 SCF / CloudBase",
      "GitHub Pages",
      "Canvas",
      "Web Audio API",
    ],
    contributions: [
      "将静态原型重构为单页应用，完成登录、MBTI 问卷、三步计划、冥想计时、桌宠状态、本地存档与响应式界面。",
      "接入 DeepSeek 心语与结构化计划生成，实现 JSON 校验、自动修复和异常降级，并开发 3 套云端代理完成密钥隔离、CORS、限流与超时控制。",
      "开发 Chrome Extension MV3，通过消息桥、storage 与 alarms 持久化计时会话，实现跨站倒计时、最后一分钟提醒、3 分钟延长、到点自动返回与计划步骤推进。",
      "支持小红书、B 站、抖音等 8 类平台关键词直达，处理微信内置浏览器与小红书 Deep Link 兼容，并完成移动端 Canvas 降载与输入转义。",
    ],
    outcome:
      "形成“目标拆解 - 平台直达 - 跨站计时 - 自动回流 - 计划步进”的完整闭环，覆盖 8 类常见内容与娱乐平台；完成网页端、浏览器扩展与 3 套云端 AI 代理的多端协作，兼顾国内网络环境、移动端性能与服务安全。",
    href: "https://0711hackson.github.io/tryrevive",
    hrefLabel: "体验 Tryrevive",
    featured: true,
  },
  {
    title: "论文研读与综述助手 Evidence-first Paper Agent",
    period: "2026.06 - 至今",
    role: "AI Agent / RAG 开发",
    focus: "论文检索 + 证据链",
    summary:
      "面向学生和科研人员，解决论文检索、PDF 解析、证据定位、Claims 提取与综述生成难以追溯的问题，搭建一站式论文研读工作台。",
    challenge:
      "面向学生和科研人员，解决论文检索、PDF 解析、证据定位、Claims 提取与综述生成难以追溯的问题，搭建一站式论文研读工作台。",
    stack: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "Vite",
      "SQLite",
      "SSE",
      "arXiv",
      "Semantic Scholar",
      "OpenAlex",
      "PyMuPDF",
      "DeepSeek API",
    ],
    contributions: [
      "接入多源论文检索，完成去重、排序、PDF 解析和页码/章节级 Evidence 生成。",
      "串联检索、Claims 提取、方法对比和综述生成，支持后台执行、SSE 进度、失败重试与重启恢复。",
      "实现论文、证据、Claims、综述和导出页面，支持翻译及 Markdown、BibTeX、CSV、JSONL 产物导出。",
    ],
    outcome:
      "在 50 条自建离线排序压力测试中，Top-1 64%、Top-3 90%、MRR@3 0.7567，较输入顺序基线分别提升 38、16、30 个百分点；后端 48 项测试全部通过，完成从研究问题到可追溯综述导出的完整流程。",
    href: "https://github.com/huige66631/paper-reading-desk",
  },
  {
    title: "AI 行业情报自动采集与知识蒸馏系统",
    period: "2026.06 - 至今",
    role: "自动化工作流",
    focus: "采集 - 蒸馏 - 沉淀",
    summary:
      "针对 AI 行业信息更新快、来源分散、手工整理成本高的问题，搭建个人 AI 情报知识系统，实现采集、日报整理、周级蒸馏与长期回填。",
    challenge:
      "AI 行业更新快、来源分散、长期知识难沉淀，手工整理既耗时，也很难形成稳定的知识迭代机制。",
    stack: [
      "Obsidian",
      "Horizon",
      "Codex",
      "PowerShell",
      "Scheduled Tasks",
      "Markdown",
      "DeepSeek API",
      "GitHub",
    ],
    contributions: [
      "接入 GitHub、RSS、Hacker News、Reddit、OSS Insight 等约 20 个资讯入口，形成 AI 行业日报采集链路。",
      "通过 Codex 自动化任务完成日报整理、周报蒸馏与长期知识回填，降低重复整理成本。",
      "结合 PowerShell 脚本与 Windows Scheduled Tasks，完成日报发布、知识库同步与本地维护。",
    ],
    outcome:
      "打通“日报采集 - 自动整理 - 周报生成 - 长期回填”链路，当前配置下预计每天节省约 30-45 分钟信息整理时间。",
  },
  {
    title: "法律合同审查 RAG 智能审查平台",
    period: "2026.07 - 至今",
    role: "RAG 开发",
    focus: "合同审查 + 风险提示",
    summary:
      "面向企业经营者、法务及人力资源人员，构建具备对话式 Agent 的中文合同审查平台，支持 DOCX/PDF 上传、风险识别、法律依据检索、对话修改及原文差异对比。",
    challenge:
      "面向企业经营者、法务及人力资源人员，构建具备对话式 Agent 的中文合同审查平台，支持 DOCX/PDF 上传、风险识别、法律依据检索、对话修改及原文差异对比。",
    stack: [
      "Vue 3",
      "Node.js",
      "Express",
      "PostgreSQL",
      "SSE",
      "RAG",
      "DeepSeek/OpenAI 兼容大模型",
      "BAAI/bge-small-zh-v1.5（512 维）",
      "规则引擎",
      "文本 Diff",
    ],
    contributions: [
      "实现合同 Agent 工具调用流程，根据用户意图自主读取合同、定位条款、检索法律依据并生成审查结论。",
      "用户通过自然语言提出修改要求后，Agent 自动定位原文、生成替换文本和 Diff 预览，确认后创建新合同版本。",
      "基于 PostgreSQL 建设法律事实库，已导入 6.4 万+ 条法律条文及案例，保留来源、版本和内容 hash。",
    ],
    outcome:
      "实现“对话审查 - 法律引用 - 修改提案 - 确认写入 - 版本对比”智能化闭环；支持 DOCX/PDF 合同上传、风险问题清单、法律依据展示、修改建议与修订文本差异对比；后端 20/20 测试通过，前端生产构建成功。",
    href: "https://tryrevive-d4gzac2aj49df4aa4-1453581918.tcloudbaseapp.com/",
    hrefLabel: "在线演示（简化版）",
  },
];

const signals = [
  { label: "项目方向", value: "Agent / AI 应用 / RAG / 自动化" },
  { label: "表达重点", value: "需求拆解 - 工具调用 - 评测优化 - 部署演示" },
  { label: "偏好风格", value: "偏工程落地，强调数据依据与可复测闭环" },
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
              className={`overflow-hidden rounded-[34px] border backdrop-blur-sm ${
                project.featured
                  ? "border-violet-200/20 bg-[radial-gradient(circle_at_12%_8%,rgba(125,211,252,0.12),transparent_28%),linear-gradient(180deg,rgba(139,92,246,0.10),rgba(255,255,255,0.025))] shadow-[0_24px_90px_rgba(77,55,155,0.12)]"
                  : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))]"
              }`}
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
                      {project.hrefLabel ?? "查看项目仓库"}
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
