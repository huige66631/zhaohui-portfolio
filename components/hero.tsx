"use client";

import { ArrowDown, ArrowRight, Download } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { PortraitMorph } from "./portrait-morph";
import { ShaderFlow } from "./shader-flow";
import { VisitorDeviceCount } from "./visitor-device-count";

const capabilityPills = [
  "Agent 工作流",
  "RAG 应用",
  "自动化系统",
  "AI 原型落地",
];

function useTouchLikeDevice(): boolean {
  const [isTouchLike, setIsTouchLike] = useState(false);

  useEffect(() => {
    const queries = [
      window.matchMedia("(hover: none)"),
      window.matchMedia("(pointer: coarse)"),
      window.matchMedia("(max-width: 1023px)"),
    ];

    const syncInputMode = (): void => {
      setIsTouchLike(queries.some((query) => query.matches));
    };

    syncInputMode();
    queries.forEach((query) => {
      query.addEventListener("change", syncInputMode);
    });

    return () => {
      queries.forEach((query) => {
        query.removeEventListener("change", syncInputMode);
      });
    };
  }, []);

  return isTouchLike;
}

export function Hero(): ReactNode {
  const isTouchLike = useTouchLikeDevice();

  return (
    <section id="home" className="px-4 pt-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto min-h-[calc(100svh-1rem)] max-w-[1500px] overflow-hidden rounded-[2rem] border border-violet-300/12 bg-[#080611] shadow-[0_30px_120px_rgba(6,3,18,0.55)] lg:h-[min(calc(100svh-1rem),860px)] lg:min-h-[820px]">
        <div className="pointer-events-none absolute inset-0 z-0">
          <ShaderFlow
            className="absolute inset-0 z-0 h-full w-full opacity-82"
            brightness={1.2}
            iterations={12}
            scale={5.2}
            flowSpeed={[0.03, 0.11]}
            colorLowA={[0.12, 0.08, 0.25]}
            colorHighA={[0.56, 0.4, 0.95]}
            fadeCx={0.5}
            fadeCy={0.1}
            fadeRx={1.4}
            fadeRy={0.84}
          />
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_18%_24%,rgba(160,120,255,0.18),transparent_24%),radial-gradient(circle_at_78%_34%,rgba(116,82,255,0.18),transparent_22%),linear-gradient(180deg,rgba(8,6,17,0.16),rgba(8,6,17,0.46)_55%,rgba(8,6,17,0.84))]" />
          <div className="absolute inset-y-0 left-0 z-20 w-[52%] bg-[linear-gradient(90deg,rgba(8,6,17,0.82),rgba(8,6,17,0.56)_45%,rgba(8,6,17,0.10)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-1rem)] max-w-[1460px] flex-col justify-start px-6 pt-28 pb-12 sm:px-10 sm:pt-32 lg:h-[min(calc(100svh-1rem),860px)] lg:min-h-[820px] lg:px-12 lg:pt-36">
          <div className="grid items-start gap-12 lg:-translate-y-[100px] lg:grid-cols-[minmax(0,1.02fr)_minmax(430px,590px)] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_minmax(470px,620px)] xl:gap-20">
            <div className="max-w-[780px]">
              <motion.p
                className="text-base font-medium tracking-[0.01em] text-violet-50/78"
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                赵晖 / AI 应用开发 / Agent / 自动化
              </motion.p>

              <motion.h1
                className="mt-5 max-w-[11.2ch] text-[3.35rem] leading-[1.08] font-medium tracking-tight [text-wrap:balance] text-white sm:max-w-[11.8ch] sm:text-[3.75rem] md:max-w-[12.2ch] md:text-[4.25rem] lg:max-w-[12.6ch] lg:text-[3.65rem] xl:text-[3.75rem] 2xl:text-[4.15rem]"
                initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.62,
                  delay: 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                把 Agent、自动化与真实业务
                <span className="mt-2 block text-violet-100/88">
                  做成真正可落地的应用
                </span>
              </motion.h1>

              <motion.p
                className="mt-8 max-w-[31ch] text-lg leading-[1.72] text-violet-50/78 sm:text-[1.65rem]"
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.55,
                  delay: 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                通信工程背景，持续做
                Agent、RAG、知识助手与自动化系统方向的项目实践。
                我更在意的不只是模型能不能跑，而是它能不能进入真实流程、持续迭代，并稳定产生价值。
              </motion.p>

              <motion.div
                className="mt-11 flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.55,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#140f24] shadow-[0_10px_30px_rgba(255,255,255,0.10)] transition-colors hover:bg-violet-100"
                >
                  查看项目
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/resume-zhaohui.pdf"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/7 px-5 py-3 text-sm font-medium text-violet-50/92 transition-colors hover:border-white/30 hover:bg-white/12"
                >
                  下载简历
                  <Download className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div
                className="mt-10 flex flex-wrap gap-2.5"
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.55,
                  delay: 0.28,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {capabilityPills.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-violet-200/14 bg-violet-200/8 px-3.5 py-1.5 text-sm text-violet-50/78"
                  >
                    {item}
                  </span>
                ))}
              </motion.div>
            </div>

            <motion.div
              className="relative mx-auto mt-2 w-full max-w-[560px] lg:mx-0 lg:mt-6 lg:justify-self-end"
              initial={{ opacity: 0, y: 28, scale: 0.98, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.7,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className={`${isTouchLike ? "flex" : "hidden"} mb-5 items-center justify-center gap-3 text-violet-50/72`}
              >
                <span className="text-sm leading-6">长按下方图片有效果</span>
                <motion.span
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-200/18 bg-sky-200/8 text-sky-100/90 shadow-[0_0_24px_rgba(125,211,252,0.12)]"
                  animate={{ y: [0, 7, 0], opacity: [0.62, 1, 0.62] }}
                  transition={{
                    duration: 1.45,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  aria-hidden="true"
                >
                  <ArrowDown className="h-4 w-4" />
                </motion.span>
              </div>

              <div
                className={`pointer-events-none absolute top-[43%] -left-[15.25rem] z-20 w-56 items-center justify-end gap-3 xl:-left-[16.25rem] ${
                  isTouchLike ? "hidden" : "hidden lg:flex"
                }`}
              >
                <p className="max-w-[10rem] text-right text-sm leading-6 text-violet-50/68">
                  鼠标悬停右侧图片有效果
                </p>
                <span className="h-px w-9 bg-[linear-gradient(90deg,rgba(186,230,253,0),rgba(186,230,253,0.72))]" />
                <motion.span
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-200/18 bg-sky-200/8 text-sky-100/90 shadow-[0_0_24px_rgba(125,211,252,0.12)]"
                  animate={{ x: [0, 8, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  aria-hidden="true"
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] border border-violet-200/14 bg-white/8 p-1.5 shadow-[0_24px_80px_rgba(9,4,27,0.42)]">
                <div className="relative aspect-square overflow-hidden rounded-[1.65rem] bg-[#100a20]">
                  <PortraitMorph
                    srcA="/img/portrait-main.webp"
                    srcB="/img/portrait-wave.webp"
                    alt="赵晖首页头像"
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
              <VisitorDeviceCount />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
