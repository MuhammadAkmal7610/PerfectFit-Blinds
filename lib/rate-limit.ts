import "server-only";
import { createHmac } from "crypto";

export function getEnquiryFingerprint(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || "unknown";
  const secret = process.env.RATE_LIMIT_SECRET?.trim()
    || process.env.ADMIN_SESSION_SECRET?.trim();

  if (!secret || secret.length < 32) {
    throw new Error("Rate limiting requires RATE_LIMIT_SECRET or a valid ADMIN_SESSION_SECRET.");
  }

  return createHmac("sha256", secret).update(ip).digest("hex");
}