import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler = (req: NextRequest, ctx: any) => {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "http";
  
  if (host) {
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
  }
  
  return NextAuth(authOptions)(req, ctx);
};

export { handler as GET, handler as POST };
