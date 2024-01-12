import { TRPCError } from "@trpc/server";
import axios from "axios";
import { eq } from "drizzle-orm";
import { db } from "~/db.server";
import { serversTable } from "~/schema.server";

export async function rpc(
  server: { url: string; apiKey: string },
  method: string,
  params: unknown
) {
  const response = await axios.post(
    `${server.url}rpc/${method}`,
    { params },
    {
      headers: { "x-api-key": server.apiKey },
    }
  );
  if (!response.data.result) {
    console.error(response.data);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: JSON.stringify(response.data),
    });
  }
  return response.data.result;
}
export async function getServerInfo(serverId: string) {
  const info = await db
    .select()
    .from(serversTable)
    .where(eq(serversTable.id, serverId))
    .get();
  if (!info) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }
  return info;
}
