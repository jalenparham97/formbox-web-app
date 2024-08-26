import { Nango } from "@nangohq/node";
import { env } from "@/env";
import type { IntegrationType } from "@/types/integration.types";

export const nango = new Nango({ secretKey: env.NANGO_SECRET_KEY });

export async function getAccessToken(
  integration: IntegrationType,
  connectionId: string,
) {
  const accessToken = await nango.getToken(integration, connectionId);
  return accessToken;
}
