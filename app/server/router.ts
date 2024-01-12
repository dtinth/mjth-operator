import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";
import { z } from "zod";
import { getServerInfo, rpc } from "~/utils/jamulus";

export const t = initTRPC.context<Context>().create();

async function requireAuth(ctx: Context) {
  const { userId } = await ctx.getAuth();
  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }
  if (userId !== process.env.ADMIN_USER_ID) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Forbidden" });
  }
}

export const appRouter = t.router({
  whoami: t.procedure.query(async ({ ctx }) => {
    const { userId } = await ctx.getAuth();
    return { ok: true, userId };
  }),
  getClients: t.procedure
    .input(z.object({ serverId: z.string() }))
    .query(async ({ input, ctx }) => {
      await requireAuth(ctx);
      const serverId = input.serverId;
      const info = await getServerInfo(serverId);
      const response = await rpc(info, "jamulusserver/getClients", {});
      return response;
    }),
  getServerProfile: t.procedure
    .input(z.object({ serverId: z.string() }))
    .query(async ({ input, ctx }) => {
      await requireAuth(ctx);
      const serverId = input.serverId;
      const info = await getServerInfo(serverId);
      const response = await rpc(info, "jamulusserver/getServerProfile", {});
      return response;
    }),
});

export type AppRouter = typeof appRouter;
