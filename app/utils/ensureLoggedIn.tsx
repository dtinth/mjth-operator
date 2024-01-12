import { redirect, LoaderFunctionArgs } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";

export async function ensureLoggedIn(args: LoaderFunctionArgs) {
  const { userId } = await getAuth(args);
  if (!userId) {
    throw redirect("/sign-in");
  }
  if (userId !== process.env.ADMIN_USER_ID) {
    throw redirect("/forbidden");
  }
}
