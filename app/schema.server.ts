import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { ServerSettings } from "./ServerSettings";

export const serversTable = sqliteTable("servers", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  apiKey: text("api_key").notNull(),
  settings: text("settings", { mode: "json" })
    .$type<ServerSettings>()
    .default({}),
});
