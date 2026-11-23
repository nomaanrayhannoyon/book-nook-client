import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is missing from .env.local");
}

export interface JwtUser {
  sub: string;
  email: string;
  name: string;
}


export function signToken(payload: JwtUser): string {
  return jwt.sign(payload, secret!, { expiresIn: "7d" });
}
