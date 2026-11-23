import { NextResponse, type NextRequest } from "next/server";
import { connection } from "next/server";
import { getAuth } from "@/lib/auth";
import { signToken } from "@/lib/jwt";


export async function GET(request: NextRequest) {

  await connection();
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {

      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const token = signToken({
      sub: session.user.id,

      email: session.user.email,
      name: session.user.name,
    });
    return NextResponse.json({ token });

  } catch (err) {
    console.error("Token exchange failed:", err);
    
    return NextResponse.json({ error: "Token exchange failed" }, { status: 500 });
  }
}
