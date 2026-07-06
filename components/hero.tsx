"use client";

import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { FluidCursor } from "./fluid-cursor";

export function Hero(): ReactNode {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollY, scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const scaleYRaw = useTransform(scrollYProgress, [0, 0.6], [1, 0.18]);
  const scaleY = useSpring(scaleYRaw, { stiffness: 100, damping: 28 });
  const y = useTransform(scrollY, (value) => value * 0.38);

  return (
    <section ref={sectionRef} className="relative min-h-dvh w-full overflow-hidden">
      <FluidCursor className="absolute inset-0 -z-10 opacity-90" />

      <motion.div
        className="pointer-events-none absolute inset-0 -z-20 origin-top will-change-transform"
        style={{ scaleY, y }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(139,149,255,0.26),transparent_24%),radial-gradient(circle_at_78%_58%,rgba(83,95,220,0.34),transparent_28%),linear-gradient(180deg,#060711_0%,#0b1020_52%,#06070b_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </motion.div>

      <div className="mx-auto flex min-h-dvh max-w-7xl flex-col justify-between px-4 pb-14 pt-32 sm:px-6 md:pb-16 lg:px-8 lg:pt-38">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <motion.p
              className="text-sm text-foreground/55"
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              赵晖 / AI 应用开发 / Agent / 自动化
            </motion.p>

            <motion.h1
              className="mt-6 max-w-4xl text-4xl leading-[0.98] font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[4.9rem]"
              initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.62,
                delay: 0.05,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              把 Agent、自动化与
              <span className="block text-foreground/78">
                真实业务场景
              </span>
              <span className="block text-foreground/62 italic">
                做成可落地的应用
              </span>
            </motion.h1>

            <motion.p
              className="mt-8 max-w-2xl text-base leading-8 text-foreground/62 sm:text-lg"
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.55,
                delay: 0.14,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              通信工程背景，持续做 Agent、RAG、工作流自动化与知识系统方向的项目实践。
              希望进入能把技术能力真正转化为业务价值的团队，参与从问题定义到应用落地的完整过程。
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.55,
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <Link
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm text-background transition-colors hover:bg-foreground/92"
              >
                查看项目
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/resume-zhaohui.pdf"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm text-foreground/84 transition-colors hover:bg-white/[0.07]"
              >
                下载简历
                <Download className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="justify-self-end rounded-[34px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl lg:max-w-md"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.65,
              delay: 0.16,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
              <div className="grid gap-4">
                <div className="rounded-[26px] border border-white/8 bg-black/10 p-5">
                  <p className="text-sm text-foreground/46">求职方向</p>
                  <p className="mt-3 text-lg leading-8 text-foreground/84">
                    AI 应用开发、Agent 工作流、知识系统、自动化效率工具
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-5">
                    <p className="text-sm text-foreground/46">代表项目</p>
                    <p className="mt-3 text-base leading-7 text-foreground/82">
                      NetDiag Agent / 企业知识助手 / AI 情报蒸馏系统
                    </p>
                  </div>
                  <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-5">
                    <p className="text-sm text-foreground/46">工作方式</p>
                    <p className="mt-3 text-base leading-7 text-foreground/82">
                      偏工程落地，重视结构化拆解、结果可解释性与持续迭代。
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
        </div>

        <motion.div
          className="mt-16 flex items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div />
          <ArrowDown className="h-11 w-11 text-foreground/42" strokeWidth={1.2} />
        </motion.div>
      </div>
    </section>
  );
}
