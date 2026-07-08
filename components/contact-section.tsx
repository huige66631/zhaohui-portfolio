"use client";

import { ArrowUpRight, Download, Mail, Phone } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

const contactItems = [
  {
    label: "电话",
    value: "19959709053",
    href: "tel:19959709053",
    icon: Phone,
  },
  {
    label: "邮箱",
    value: "1030089807@qq.com",
    href: "mailto:1030089807@qq.com",
    icon: Mail,
  },
];

const intentions = [
  "AI 应用开发",
  "Agent 工作流",
  "RAG / 知识系统",
  "自动化工具",
];

export function ContactSection(): ReactNode {
  return (
    <section id="contact" className="px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="overflow-hidden rounded-[38px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(121,131,255,0.2),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]"
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="border-b border-white/8 p-7 sm:p-9 md:p-12 lg:border-b-0 lg:border-r">
              <p className="text-sm text-foreground/42">联系方式</p>
              <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl">
                我希望进入能把 AI 能力真正做成应用闭环的团队
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-foreground/64">
                如果你正在寻找一位愿意快速学习、能把问题拆开并推进到可运行、可验证原型的候选人，欢迎直接联系我。
              </p>

              <div className="mt-8 flex flex-wrap gap-2.5">
                {intentions.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-foreground/66"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/resume-zhaohui.pdf"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm text-background transition-colors hover:bg-foreground/90"
                >
                  <Download className="h-4 w-4" />
                  查看简历
                </Link>
                <Link
                  href="https://github.com/huige66631"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-sm text-foreground/82 transition-colors hover:bg-white/6"
                >
                  GitHub
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-0">
              <div className="border-b border-white/8 p-7 sm:p-9 md:p-10">
                <p className="text-xs text-foreground/38">当前意向</p>
                <p className="mt-3 max-w-lg text-base leading-8 text-foreground/72">
                  关注 AI Agent 开发、RAG 应用开发与自动化工作流方向的岗位，希望参与从问题定义、工具调用、评测优化到部署演示的完整过程。
                </p>
              </div>

              <div className="grid sm:grid-cols-2">
                {contactItems.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`p-7 transition-colors hover:bg-white/[0.04] sm:p-9 ${
                      index === 0 ? "border-b border-white/8 sm:border-b-0 sm:border-r" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 text-foreground/46">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <p className="mt-4 text-lg text-foreground/86">{item.value}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
