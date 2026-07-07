"use client";

import { useEffect, useState, type ReactNode } from "react";

const DEVICE_STORAGE_KEY = "resume_device_id_v1";

type VisitorCountState =
  | {
      latestDeviceName: null;
      latestNewDeviceAt: null;
      status: "loading";
      total: null;
    }
  | {
      latestDeviceName: string | null;
      latestNewDeviceAt: string | null;
      status: "ready";
      total: number;
    }
  | {
      latestDeviceName: null;
      latestNewDeviceAt: null;
      status: "error";
      total: null;
    };

interface BrowserDeviceInfo {
  deviceFingerprintHint: string;
  deviceModel: string | null;
  deviceName: string;
  devicePlatform: string | null;
  deviceType: "电脑" | "平板" | "手机" | "设备";
}

interface NavigatorUserAgentDataLike {
  getHighEntropyValues?: (hints: string[]) => Promise<Record<string, unknown>>;
  mobile?: boolean;
  platform?: string;
}

function createDeviceId(): string {
  if (typeof window.crypto?.randomUUID === "function") {
    return `device_${window.crypto.randomUUID().replace(/-/g, "")}`;
  }

  return `device_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 14)}`;
}

function getOrCreateDeviceId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const existing = window.localStorage.getItem(DEVICE_STORAGE_KEY);
    if (existing) return existing;

    const nextId = createDeviceId();
    window.localStorage.setItem(DEVICE_STORAGE_KEY, nextId);
    return nextId;
  } catch {
    return null;
  }
}

function formatVisitorTime(value: string | null): string {
  if (!value) return "暂无记录";

  const date = new Date(`${value.replace(" ", "T")}Z`);
  if (Number.isNaN(date.getTime())) return "暂无记录";

  const pad = (part: number) => part.toString().padStart(2, "0");

  return `${date.getFullYear()}年${pad(date.getMonth() + 1)}月${pad(date.getDate())}日${pad(date.getHours())}时${pad(date.getMinutes())}分${pad(date.getSeconds())}秒`;
}

function normalizeDeviceText(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed ? trimmed.slice(0, 80) : null;
}

function detectDeviceType(
  userAgent: string,
  isMobileHint?: boolean
): BrowserDeviceInfo["deviceType"] {
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) return "平板";
  if (
    isMobileHint ||
    /mobile|iphone|ipod|android.*mobile|windows phone/i.test(userAgent)
  ) {
    return "手机";
  }
  return "电脑";
}

function normalizePlatform(platform: string | null, userAgent: string): string {
  const source = `${platform ?? ""} ${userAgent}`;

  if (/iphone|ipad|ipod|ios/i.test(source)) return "iOS";
  if (/android/i.test(source)) return "Android";
  if (/windows/i.test(source)) return "Windows";
  if (/mac os|macintosh|macintel|mac/i.test(source)) return "macOS";
  if (/linux/i.test(source)) return "Linux";

  return normalizeDeviceText(platform) ?? "未知系统";
}

function inferModelFromUserAgent(userAgent: string): string | null {
  const androidModel = userAgent.match(
    /Android\s[\d.]+;\s*([^)]*?)\s+Build/i
  )?.[1];
  if (androidModel) {
    return normalizeDeviceText(androidModel.split(";").pop());
  }

  if (/ipad/i.test(userAgent)) return "iPad";
  if (/iphone|ipod/i.test(userAgent)) return "iPhone";

  return null;
}

function createDeviceName({
  model,
  platform,
  type,
}: {
  model: string | null;
  platform: string;
  type: BrowserDeviceInfo["deviceType"];
}): string {
  if (model === "iPhone" && platform === "iOS") return "iPhone 手机";
  if (model === "iPad" && platform === "iOS") return "iPad 平板";

  if (model) {
    return platform && !model.toLowerCase().includes(platform.toLowerCase())
      ? `${model} ${platform} ${type}`
      : `${model} ${type}`;
  }

  if (platform === "iOS" && type === "手机") return "iPhone 手机";
  if (platform === "iOS" && type === "平板") return "iPad 平板";

  return `${platform} ${type}`;
}

function createDeviceFingerprintHint({
  model,
  platform,
  type,
}: {
  model: string | null;
  platform: string;
  type: BrowserDeviceInfo["deviceType"];
}): string {
  const screenSize = window.screen
    ? [
        Math.min(window.screen.width, window.screen.height),
        Math.max(window.screen.width, window.screen.height),
      ].join("x")
    : "unknown-screen";
  const pixelRatio = window.devicePixelRatio
    ? window.devicePixelRatio.toFixed(2)
    : "unknown-ratio";
  const hardwareConcurrency =
    typeof window.navigator.hardwareConcurrency === "number"
      ? window.navigator.hardwareConcurrency.toString()
      : "unknown-cores";
  const maxTouchPoints =
    typeof window.navigator.maxTouchPoints === "number"
      ? window.navigator.maxTouchPoints.toString()
      : "unknown-touch";
  const timezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? "unknown-timezone";

  return [
    platform,
    type,
    model ?? "unknown-model",
    screenSize,
    pixelRatio,
    hardwareConcurrency,
    maxTouchPoints,
    timezone,
  ].join("|");
}

async function getBrowserDeviceInfo(): Promise<BrowserDeviceInfo> {
  const userAgent = window.navigator.userAgent;
  const userAgentData = (
    window.navigator as Navigator & {
      userAgentData?: NavigatorUserAgentDataLike;
    }
  ).userAgentData;
  let highEntropyValues: Record<string, unknown> = {};
  if (userAgentData?.getHighEntropyValues) {
    highEntropyValues = await userAgentData
      .getHighEntropyValues([
        "model",
        "platform",
        "platformVersion",
        "architecture",
      ])
      .catch(() => ({}));
  }

  const model =
    normalizeDeviceText(highEntropyValues?.model) ??
    inferModelFromUserAgent(userAgent);
  const rawPlatform =
    normalizeDeviceText(highEntropyValues?.platform) ??
    normalizeDeviceText(userAgentData?.platform) ??
    normalizeDeviceText(window.navigator.platform);
  const type = detectDeviceType(userAgent, userAgentData?.mobile);
  const platform = normalizePlatform(rawPlatform, userAgent);
  const architecture = normalizeDeviceText(highEntropyValues?.architecture);
  const desktopModel =
    type === "电脑" && architecture ? `${platform} ${architecture}` : null;
  const deviceModel = model ?? desktopModel;

  return {
    deviceFingerprintHint: createDeviceFingerprintHint({
      model: deviceModel,
      platform,
      type,
    }),
    deviceModel,
    deviceName: createDeviceName({
      model: deviceModel,
      platform,
      type,
    }),
    devicePlatform: platform,
    deviceType: type,
  };
}

export function VisitorDeviceCount(): ReactNode {
  const [visitorCount, setVisitorCount] = useState<VisitorCountState>({
    latestDeviceName: null,
    latestNewDeviceAt: null,
    status: "loading",
    total: null,
  });

  useEffect(() => {
    const deviceId = getOrCreateDeviceId();

    if (!deviceId) {
      setVisitorCount({
        latestDeviceName: null,
        latestNewDeviceAt: null,
        status: "error",
        total: null,
      });
      return;
    }

    const controller = new AbortController();

    const syncVisitor = async () => {
      try {
        const deviceInfo = await getBrowserDeviceInfo();
        const response = await fetch("/api/visitors", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          cache: "no-store",
          signal: controller.signal,
          body: JSON.stringify({ deviceId, ...deviceInfo }),
        });

        if (!response.ok) {
          throw new Error(`Visitor API failed: ${response.status}`);
        }

        const payload = (await response.json()) as {
          latestDeviceName?: string | null;
          latestNewDeviceAt?: string | null;
          total?: number;
        };

        setVisitorCount({
          latestDeviceName:
            typeof payload.latestDeviceName === "string"
              ? payload.latestDeviceName
              : null,
          latestNewDeviceAt:
            typeof payload.latestNewDeviceAt === "string"
              ? payload.latestNewDeviceAt
              : null,
          status: "ready",
          total: typeof payload.total === "number" ? payload.total : 0,
        });
      } catch {
        if (!controller.signal.aborted) {
          setVisitorCount({
            latestDeviceName: null,
            latestNewDeviceAt: null,
            status: "error",
            total: null,
          });
        }
      }
    };

    void syncVisitor();

    return () => {
      controller.abort();
    };
  }, []);

  const countText =
    visitorCount.status === "ready"
      ? `${visitorCount.total} 台`
      : visitorCount.status === "loading"
        ? "统计中"
        : "暂不可用";

  const latestTimeText =
    visitorCount.status === "ready"
      ? formatVisitorTime(visitorCount.latestNewDeviceAt)
      : visitorCount.status === "loading"
        ? "统计中"
        : "暂不可用";
  const latestDeviceText =
    visitorCount.status === "ready"
      ? (visitorCount.latestDeviceName ?? "未知设备")
      : visitorCount.status === "loading"
        ? "统计中"
        : "暂不可用";

  return (
    <div
      className="mt-5 px-2 text-[18px] leading-[1.72] text-violet-50/78 lg:px-1"
      aria-live="polite"
    >
      <p>
        当前网址历史访问设备：
        <span className="font-medium text-violet-50">{countText}</span>
      </p>
      <p>
        最近新设备访问时间：
        <span className="font-medium text-violet-50">{latestTimeText}</span>
      </p>
      <p>
        最新访问设备：
        <span className="font-medium text-violet-50">{latestDeviceText}</span>
      </p>
      <p className="mt-2 max-w-[34rem] text-[13px] leading-5 text-violet-50/46">
        说明：这里的“最新访问设备”指历史访问设备中最近首次出现的一台；同一设备多次访问、或同一设备使用不同浏览器访问，会尽量合并为
        1 台。
      </p>
    </div>
  );
}
