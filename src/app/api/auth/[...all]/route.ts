import { toNextJsHandler } from "better-auth/next-js";
import { connection } from "next/server";
import { getAuth } from "@/lib/auth";


const handler = toNextJsHandler(async (request: Request) => {
  await connection();
  // Resolve a healthy Mongo client on every request — warm lambdas can retain
  // a closed topology after an Atlas failover, which breaks all auth calls.
  const auth = await getAuth();
  return auth.handler(request);
});

export const { GET, POST } = handler;
