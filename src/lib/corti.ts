import "server-only";

type CortiMode = "demo" | "ready" | "live";

interface CortiConfig {
  clientId?: string;
  clientSecret?: string;
  environment: string;
  tenant: string;
  liveSync: boolean;
}

export interface CortiStatus {
  mode: CortiMode;
  connected: boolean;
  environment: string;
  tenant: string;
  credentialsPresent: boolean;
  liveSyncEnabled: boolean;
}

function getCortiConfig(): CortiConfig {
  return {
    clientId: process.env.CORTI_CLIENT_ID,
    clientSecret: process.env.CORTI_CLIENT_SECRET,
    environment: process.env.CORTI_ENVIRONMENT ?? "eu",
    tenant: process.env.CORTI_TENANT ?? "base",
    liveSync: process.env.CORTI_LIVE_SYNC === "true",
  };
}

export function getCortiStatus(): CortiStatus {
  const config = getCortiConfig();
  const credentialsPresent = Boolean(config.clientId && config.clientSecret);
  const mode: CortiMode = credentialsPresent ? (config.liveSync ? "live" : "ready") : "demo";

  return {
    mode,
    connected: credentialsPresent,
    environment: config.environment,
    tenant: config.tenant,
    credentialsPresent,
    liveSyncEnabled: config.liveSync,
  };
}

async function getAccessToken(config: CortiConfig) {
  if (!config.clientId || !config.clientSecret) {
    throw new Error("Corti credentials are not configured.");
  }

  const response = await fetch(
    `https://auth.${config.environment}.corti.app/realms/${config.tenant}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: config.clientId,
        client_secret: config.clientSecret,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    },
  );

  if (!response.ok) {
    throw new Error(`Corti authentication failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as { access_token?: string };
  if (!payload.access_token) {
    throw new Error("Corti authentication did not return an access token.");
  }

  return payload.access_token;
}

export async function createCortiInteraction(caseId: string) {
  const config = getCortiConfig();
  const status = getCortiStatus();

  if (status.mode !== "live") {
    return {
      mode: status.mode,
      synced: false,
      interactionId: `demo-${caseId.toLowerCase()}`,
      message:
        status.mode === "ready"
          ? "Corti credentials are ready. Set CORTI_LIVE_SYNC=true to create live interactions."
          : "Corti is using safe demo context until server credentials are configured.",
    };
  }

  const token = await getAccessToken(config);
  const response = await fetch(`https://api.${config.environment}.corti.app/v2/interactions/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Tenant-Name": config.tenant,
    },
    body: JSON.stringify({
      encounter: {
        identifier: caseId,
        title: "Farz+ human handoff review",
        status: "planned",
        type: "first_consultation",
      },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`Corti interaction creation failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as { interactionId: string };
  return {
    mode: "live" as const,
    synced: true,
    interactionId: payload.interactionId,
    message: "Corti interaction created with a non-identifying Farz+ case reference.",
  };
}

