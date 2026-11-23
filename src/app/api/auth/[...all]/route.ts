import { toNextJsHandler } from "better-auth/next-js";
import { connection } from "next/server";
import { auth } from "@/lib/auth";


const handler = toNextJsHandler(async (request: Request) => {
  await connection();
  return auth.handler(request);
});

export const { GET, POST } = handler;
