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

export async function onRequestGet(context: EventContext<Env, string, unknown>): Promise<Response> {
  const result = await context.env.resume_visitors
    .prepare("SELECT COUNT(*) AS total FROM visitor_devices")
    .first<{ total: number | string }>();

  const total = Number(result?.total ?? 0);

  return createJsonResponse({
    total,
    tracked: false,
  });
}

export async function onRequestPost(
  context: EventContext<Env, string, unknown>
): Promise<Response> {
  const body = await context.request.json().catch(() => null);
  const deviceId = body && typeof body === "object" ? (body as { deviceId?: unknown }).deviceId : null;

  if (!isValidDeviceId(deviceId)) {
    return createJsonResponse({ error: "Invalid device id" }, 400);
  }

  const userAgent = context.request.headers.get("user-agent") ?? "";

  const insertResult = await context.env.resume_visitors
    .prepare(
      "INSERT OR IGNORE INTO visitor_devices (device_id, user_agent) VALUES (?1, ?2)"
    )
    .bind(deviceId, userAgent)
    .run();

  await context.env.resume_visitors
    .prepare("UPDATE visitor_devices SET last_seen_at = CURRENT_TIMESTAMP WHERE device_id = ?1")
    .bind(deviceId)
    .run();

  const countResult = await context.env.resume_visitors
    .prepare("SELECT COUNT(*) AS total FROM visitor_devices")
    .first<{ total: number | string }>();

  const total = Number(countResult?.total ?? 0);
  const tracked = (insertResult.meta?.changes ?? 0) > 0;

  return createJsonResponse({
    total,
    tracked,
  });
}
