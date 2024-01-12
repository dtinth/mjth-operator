import { getAuth } from "@clerk/remix/ssr.server";

export type Context = {
  getAuth: () => ReturnType<typeof getAuth>;
};
