interface Env {
  resume_visitors: D1Database;
}

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  });
}

function isValidDeviceId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length >= 16 &&
    value.length <= 128 &&
    /^[A-Za-z0-9_-]+$/.test(value)
  );
}

function normalizeDeviceText(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.replace(/\s+/g, " ").trim();
  if (!trimmed) return null;

  return trimmed.slice(0, 160);
}

function normalizeFingerprintText(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.replace(/\s+/g, " ").trim();
  if (!trimmed) return null;

  return trimmed.slice(0, 320);
}

function getClientNetworkIdentity(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip =
    request.headers.get("cf-connecting-ip") ??
    (forwardedFor ? forwardedFor.split(",")[0]?.trim() : null) ??
    request.headers.get("x-real-ip");

  return normalizeFingerprintText(ip)?.toLowerCase() ?? "unknown-network";
}

async function createDeviceFingerprint({
  deviceFingerprintHint,
  deviceModel,
  devicePlatform,
  deviceType,
  request,
  userAgent,
}: {
  deviceFingerprintHint: string | null;
  deviceModel: string | null;
  devicePlatform: string | null;
  deviceType: string | null;
  request: Request;
  userAgent: string;
}): Promise<string> {
  const fallbackDeviceShape = [
    devicePlatform ?? "unknown-platform",
    deviceType ?? "unknown-type",
    deviceModel ?? inferModelFromUserAgent(userAgent) ?? "unknown-model",
  ].join("|");
  const source = [
    deviceFingerprintHint ?? fallbackDeviceShape,
    getClientNetworkIdentity(request),
  ]
    .join("|")
    .toLowerCase();
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(source)
  );
  const hash = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return `fingerprint_${hash}`;
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

function inferDeviceNameFromUserAgent(value: unknown): string | null {
  const userAgent = normalizeDeviceText(value);
  if (!userAgent) return null;

  const model = inferModelFromUserAgent(userAgent);

  if (/ipad/i.test(userAgent)) return "iPad 平板";
  if (/iphone|ipod/i.test(userAgent)) return "iPhone 手机";
  if (/android/i.test(userAgent)) {
    const deviceType = /mobile/i.test(userAgent) ? "手机" : "平板";
    return model ? `${model} Android ${deviceType}` : `Android ${deviceType}`;
  }
  if (/windows/i.test(userAgent)) return "Windows 电脑";
  if (/macintosh|mac os/i.test(userAgent)) return "macOS 电脑";
  if (/linux/i.test(userAgent)) return "Linux 电脑";

  return null;
}

async function getVisitorSummary(database: D1Database): Promise<{
  latestDeviceName: string | null;
  total: number;
  latestNewDeviceAt: string | null;
}> {
  const countResult = await database
    .prepare(
      "SELECT COUNT(*) AS total FROM (SELECT 1 FROM visitor_devices GROUP BY COALESCE(device_fingerprint, device_id))"
    )
    .first<{ total: number | string }>();
  const latestResult = await database
    .prepare(
      "WITH logical_devices AS (SELECT COALESCE(device_fingerprint, device_id) AS logical_device_id, MIN(first_seen_at) AS first_seen_at, MAX(last_seen_at) AS latestNewDeviceAt FROM visitor_devices GROUP BY COALESCE(device_fingerprint, device_id)), latest_device AS (SELECT logical_device_id, latestNewDeviceAt FROM logical_devices ORDER BY first_seen_at DESC LIMIT 1) SELECT latest_device.latestNewDeviceAt AS latestNewDeviceAt, visitor_devices.device_name AS latestDeviceName, visitor_devices.user_agent AS userAgent FROM latest_device JOIN visitor_devices ON COALESCE(visitor_devices.device_fingerprint, visitor_devices.device_id) = latest_device.logical_device_id ORDER BY visitor_devices.last_seen_at DESC LIMIT 1"
    )
    .first<{
      latestDeviceName: string | null;
      latestNewDeviceAt: string | null;
      userAgent: string | null;
    }>();
  const storedDeviceName = normalizeDeviceText(latestResult?.latestDeviceName);
  const inferredDeviceName = inferDeviceNameFromUserAgent(
    latestResult?.userAgent
  );
  const shouldPreferInferredName =
    inferredDeviceName &&
    (storedDeviceName === "Android 手机" ||
      storedDeviceName === "Android 平板" ||
      storedDeviceName === "未知设备");

  return {
    latestDeviceName:
      (shouldPreferInferredName ? inferredDeviceName : storedDeviceName) ??
      inferredDeviceName ??
      "未知设备",
    total: Number(countResult?.total ?? 0),
    latestNewDeviceAt: latestResult?.latestNewDeviceAt ?? null,
  };
}

export async function onRequestGet(
  context: EventContext<Env, string, unknown>
): Promise<Response> {
  const summary = await getVisitorSummary(context.env.resume_visitors);

  return createJsonResponse({
    ...summary,
    tracked: false,
  });
}

export async function onRequestPost(
  context: EventContext<Env, string, unknown>
): Promise<Response> {
  const body = await context.request.json().catch(() => null);
  const deviceId =
    body && typeof body === "object"
      ? (body as { deviceId?: unknown }).deviceId
      : null;

  if (!isValidDeviceId(deviceId)) {
    return createJsonResponse({ error: "Invalid device id" }, 400);
  }

  const deviceName =
    body && typeof body === "object"
      ? normalizeDeviceText((body as { deviceName?: unknown }).deviceName)
      : null;
  const deviceModel =
    body && typeof body === "object"
      ? normalizeDeviceText((body as { deviceModel?: unknown }).deviceModel)
      : null;
  const deviceType =
    body && typeof body === "object"
      ? normalizeDeviceText((body as { deviceType?: unknown }).deviceType)
      : null;
  const devicePlatform =
    body && typeof body === "object"
      ? normalizeDeviceText(
          (body as { devicePlatform?: unknown }).devicePlatform
        )
      : null;
  const deviceFingerprintHint =
    body && typeof body === "object"
      ? normalizeFingerprintText(
          (body as { deviceFingerprintHint?: unknown }).deviceFingerprintHint
        )
      : null;
  const userAgent = context.request.headers.get("user-agent") ?? "";
  const deviceFingerprint = await createDeviceFingerprint({
    deviceFingerprintHint,
    deviceModel,
    devicePlatform,
    deviceType,
    request: context.request,
    userAgent,
  });
  const existingLogicalDevice = await context.env.resume_visitors
    .prepare(
      "SELECT device_id FROM visitor_devices WHERE device_id = ?1 OR device_fingerprint = ?2 LIMIT 1"
    )
    .bind(deviceId, deviceFingerprint)
    .first<{ device_id: string }>();

  const insertResult = await context.env.resume_visitors
    .prepare(
      "INSERT OR IGNORE INTO visitor_devices (device_id, user_agent, device_name, device_model, device_type, device_platform, device_fingerprint) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)"
    )
    .bind(
      deviceId,
      userAgent,
      deviceName,
      deviceModel,
      deviceType,
      devicePlatform,
      deviceFingerprint
    )
    .run();

  await context.env.resume_visitors
    .prepare(
      "UPDATE visitor_devices SET last_seen_at = CURRENT_TIMESTAMP, user_agent = ?2, device_name = COALESCE(?3, device_name), device_model = COALESCE(?4, device_model), device_type = COALESCE(?5, device_type), device_platform = COALESCE(?6, device_platform), device_fingerprint = COALESCE(?7, device_fingerprint) WHERE device_id = ?1"
    )
    .bind(
      deviceId,
      userAgent,
      deviceName,
      deviceModel,
      deviceType,
      devicePlatform,
      deviceFingerprint
    )
    .run();

  const summary = await getVisitorSummary(context.env.resume_visitors);
  const tracked =
    !existingLogicalDevice && (insertResult.meta?.changes ?? 0) > 0;

  return createJsonResponse({
    ...summary,
    tracked,
  });
}
