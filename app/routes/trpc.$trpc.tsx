import { getAuth } from "@clerk/remix/ssr.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "~/server/router";

export const loader = async (args: LoaderFunctionArgs) => {
  return handleRequest(args);
};

export const action = async (args: ActionFunctionArgs) => {
  return handleRequest(args);
};

async function handleRequest(args: LoaderFunctionArgs | ActionFunctionArgs) {
  return fetchRequestHandler({
    endpoint: "/trpc",
    req: args.request,
    router: appRouter,
    createContext: () => ({
      getAuth: () => getAuth(args),
    }),
    onError: ({ path, error }) => {
      console.error(`❌ tRPC failed on ${path}`);
      console.error(error);
    },
  });
}
