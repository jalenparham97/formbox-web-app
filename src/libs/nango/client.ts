import NangoClient from "@nangohq/frontend";
import { type IntegrationType } from "@/types/integration.types";
import { env } from "@/env";

export const nangoClient = new NangoClient({
  publicKey: env.NEXT_PUBLIC_NANGO_KEY,
});

export async function createConnection(
  integration: IntegrationType,
  connectionId: string,
) {
  try {
    const connection = await nangoClient.auth(integration, connectionId);
    return { connection, error: null };
  } catch (error) {
    console.log(error);
    return { connection: null, error };
  }
}
