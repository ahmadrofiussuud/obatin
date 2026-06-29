import { UserRole } from "@/config";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & import("next-auth").DefaultSession["user"];
  }

  interface User extends import("next-auth").DefaultUser {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
