import { classifyRisk } from "@/lib/safety-rules.mjs";

type RiskLevel = "STABLE" | "ATTENTION" | "CRITICAL";

type CortiResult = { enabled: boolean; riskLevel: RiskLevel; riskReason: string; contextSummary: string; draftedResponse: string; provider: "CORTI" | "LOCAL_SAFETY_LAYER" };

let tokenCache: { value: string; expiresAt: number } | null = null;

function localSafetyLayer(text: string): CortiResult {
  const risk = classifyRisk(text);
  const riskLevel = risk.level as RiskLevel;
  const riskReason = risk.reason;
  return { enabled: false, riskLevel, riskReason, contextSummary: "Automated clinical advice is blocked. A named Farz+ human must review the original message and recorded information.", draftedResponse: riskLevel === "CRITICAL" ? "This automated Farz+ notice may indicate an urgent situation. Please call local emergency services or the recorded emergency contact now if anyone is in immediate danger. A Farz+ care request has been created for human review." : "Thank you for the update. A Farz+ care manager is reviewing this request and will confirm the next step.", provider: "LOCAL_SAFETY_LAYER" };
}

async function getToken() {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 30_000) return tokenCache.value;
  const environment = process.env.CORTI_ENVIRONMENT ?? "eu";
  const response = await fetch(`https://auth.${environment}.corti.app/oauth/token`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "client_credentials", client_id: process.env.CORTI_CLIENT_ID ?? "", client_secret: process.env.CORTI_CLIENT_SECRET ?? "" }), cache: "no-store" });
  if (!response.ok) throw new Error(`CORTI_AUTH_${response.status}`);
  const body = await response.json() as { access_token: string; expires_in?: number };
  tokenCache = { value: body.access_token, expiresAt: Date.now() + (body.expires_in ?? 300) * 1000 };
  return body.access_token;
}

export async function analyzeWithCorti(input: { message: string; patientContext: string; consentState: string }): Promise<CortiResult> {
  const allowed = process.env.CORTI_ENABLED === "true" && process.env.CORTI_LIVE_PHI_ENABLED === "true" && process.env.CORTI_DPA_APPROVED === "true" && process.env.CORTI_TRANSFER_APPROVED === "true" && Boolean(process.env.CORTI_AGENT_ID);
  if (!allowed || input.consentState !== "VERIFIED") return localSafetyLayer(input.message);
  try {
    const environment = process.env.CORTI_ENVIRONMENT ?? "eu";
    const token = await getToken();
    const response = await fetch(`https://api.${environment}.corti.app/v2/agents/${process.env.CORTI_AGENT_ID}/v1/message:send`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "Tenant-Name": process.env.CORTI_TENANT ?? "base" }, body: JSON.stringify({ message: { role: "user", parts: [{ kind: "text", text: `Farz+ safety handoff. Do not diagnose or prescribe. Return risk level, reason, context summary, and a human-review draft. Original message: ${input.message}\nRecorded context: ${input.patientContext}` }], messageId: crypto.randomUUID(), kind: "message" } }), cache: "no-store" });
    if (!response.ok) throw new Error(`CORTI_API_${response.status}`);
    const body = await response.json() as { message?: { parts?: Array<{ text?: string }> } };
    const text = body.message?.parts?.map((part) => part.text ?? "").join("\n").trim();
    if (!text) throw new Error("CORTI_EMPTY_RESPONSE");
    const local = localSafetyLayer(input.message);
    return { ...local, enabled: true, provider: "CORTI", contextSummary: text, draftedResponse: local.draftedResponse };
  } catch {
    return localSafetyLayer(input.message);
  }
}
