import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";
import bcrypt from "bcryptjs";
import { UserRole } from "@/config";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  providers: [
    // 1. Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
    }),
    
    // 2. Email / Password Credentials Provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi.");
        }

        const email = credentials.email.toLowerCase();
        const password = credentials.password;

        try {
          // Find the user by email
          const user = await db.user.findUnique({
            where: {
              email: email,
            },
          });

          if (user && user.password) {
            // Verify password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role as UserRole,
                image: user.image,
              };
            }
          }
        } catch (dbError) {
          console.warn("[Auth DB Fallback Triggered]: Failed to reach database, using mock profiles.", dbError);
        }

        // Bypassing DB check using Sandbox Mock profiles for quick login/sandbox testing
        if (password === "password123" || password === "doctor123" || password === "patient123" || password === "admin123") {
          if (email === "patient@obatin.id") {
            return {
              id: "mock-patient-id",
              name: "Budi Santoso (Mock Pasien)",
              email: "patient@obatin.id",
              role: "PATIENT" as UserRole,
              image: null,
            };
          }
          if (email === "doctor@obatin.id") {
            return {
              id: "mock-doctor-id",
              name: "Dr. Andi Wijaya (Mock Dokter)",
              email: "doctor@obatin.id",
              role: "DOCTOR" as UserRole,
              image: null,
            };
          }
          if (email === "admin@obatin.id") {
            return {
              id: "mock-admin-id",
              name: "Admin Faskes (Mock Admin)",
              email: "admin@obatin.id",
              role: "ADMIN" as UserRole,
              image: null,
            };
          }
        }

        throw new Error("Email atau password salah.");
      },
    }),
  ],
  callbacks: {
    // Inject custom variables into JWT token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      
      // Handle dynamic session updates if needed
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      
      return token;
    },
    // Inject user id & role from token into session context
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
