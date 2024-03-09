import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "~/db.server";
import { serversTable } from "~/schema.server";
import { syncWelcomeMessage } from "~/utils/welcomeMessage";

export async function action(args: ActionFunctionArgs) {
  if (args.request.headers.get("x-secret") !== process.env.CRON_SECRET) {
    return json({ ok: false, error: "Invalid secret" }, { status: 401 });
  }
  const serverList = await db.select().from(serversTable).all();
  const result = await Promise.all(
    serverList.map(async (info) => {
      try {
        return { id: info.id, result: await syncWelcomeMessage(info.id) };
      } catch (e) {
        return { id: info.id, error: String(e) };
      }
    })
  );
  return json({ ok: true, result });
}
