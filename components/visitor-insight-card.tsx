"use client";

import { MonitorSmartphone, Radar } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

const DEVICE_STORAGE_KEY = "resume_device_id_v1";

type VisitorState =
  | { status: "loading"; total: number; tracked: boolean }
  | { status: "ready"; total: number; tracked: boolean }
  | { status: "error"; total: number; tracked: boolean };

function getOrCreateDeviceId(): string | null {
  if (typeof window === "undefined") return null;

  const existing = window.localStorage.getItem(DEVICE_STORAGE_KEY);
  if (existing) return existing;

  const nextId = `device_${window.crypto.randomUUID().replace(/-/g, "")}`;
  window.localStorage.setItem(DEVICE_STORAGE_KEY, nextId);
  return nextId;
}

export function VisitorInsightCard(): ReactNode {
  const [visitorState, setVisitorState] = useState<VisitorState>({
    status: "loading",
    total: 0,
    tracked: false,
  });

  const countMotionValue = useMotionValue(0);
  const roundedCount = useTransform(countMotionValue, (value) => Math.round(value));
  const [displayCount, setDisplayCount] = useState(0);

  useMotionValueEvent(roundedCount, "change", (value) => {
    setDisplayCount(value);
  });

  useEffect(() => {
    const controls = animate(countMotionValue, visitorState.total, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => controls.stop();
  }, [countMotionValue, visitorState.total]);

  useEffect(() => {
    const deviceId = getOrCreateDeviceId();
    if (!deviceId) {
      setVisitorState({ status: "error", total: 0, tracked: false });
      return;
    }

    let cancelled = false;

    const syncVisitor = async () => {
      try {
        const response = await fetch("/api/visitors", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({ deviceId }),
        });

        if (!response.ok) {
          throw new Error(`Visitor API failed: ${response.status}`);
        }

        const payload = (await response.json()) as {
          total?: number;
          tracked?: boolean;
        };

        if (cancelled) return;

        setVisitorState({
          status: "ready",
          total: typeof payload.total === "number" ? payload.total : 0,
          tracked: payload.tracked === true,
        });
      } catch {
        if (cancelled) return;

        setVisitorState({
          status: "error",
          total: 0,
          tracked: false,
        });
      }
    };

    void syncVisitor();

    return () => {
      cancelled = true;
    };
  }, []);

  const statusCopy = useMemo(() => {
    if (visitorState.status === "loading") {
      return {
        title: "正在记录访问",
        detail: "首次进入会登记设备标识，同一设备重复访问不会重复计数。",
      };
    }

    if (visitorState.status === "error") {
      return {
        title: "统计服务待连接",
        detail: "本地预览时可能无法读到 Cloudflare 统计接口，部署后会自动生效。",
      };
    }

    return visitorState.tracked
      ? {
          title: "已记录当前设备",
          detail: "这个设备后续再次访问不会重复累计。",
        }
      : {
          title: "当前设备已在统计中",
          detail: "系统只按唯一设备数累计访问，不按刷新次数累加。",
        };
  }, [visitorState]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 shadow-[0_18px_60px_rgba(3,6,18,0.28)] backdrop-blur-2xl"
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, delay: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(124,136,255,0.45),rgba(124,136,255,0.04)_68%,transparent_72%)]"
        animate={{ scale: [0.94, 1.06, 0.94], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute left-4 top-5 h-10 w-10 rounded-full border border-white/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      />

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-foreground/44">访客记录</p>
            <p className="mt-2 text-base leading-7 text-foreground/82">
              统计访问过这个网站的唯一设备数
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-foreground/78">
            <Radar className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end lg:grid-cols-1">
          <div>
            <div className="flex items-end gap-3">
              <span className="text-5xl leading-none font-medium tracking-tight text-foreground sm:text-6xl">
                {displayCount}
              </span>
              <span className="pb-1 text-sm text-foreground/42">台设备</span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-foreground/54">
              <MonitorSmartphone className="h-4 w-4" />
              <span>{statusCopy.title}</span>
            </div>
          </div>

          <motion.div
            className="flex items-center gap-2 rounded-full border border-emerald-400/14 bg-emerald-400/[0.08] px-3 py-2 text-xs text-emerald-200/82"
            animate={{
              boxShadow: [
                "0 0 0 rgba(52,211,153,0)",
                "0 0 18px rgba(52,211,153,0.18)",
                "0 0 0 rgba(52,211,153,0)",
              ],
            }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            去重统计中
          </motion.div>
        </div>

        <div className="mt-6 rounded-[24px] border border-white/8 bg-black/12 p-4">
          <p className="text-sm leading-7 text-foreground/64">{statusCopy.detail}</p>
        </div>
      </div>
    </motion.div>
  );
}
