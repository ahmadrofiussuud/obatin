"use client";

import { useSession } from "next-auth/react";
import { UserRole } from "@/config";

export function useAuth() {
  const { data: session, status, update } = useSession();

  const user = session?.user;
  const role = user?.role;
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  return {
    session,
    user,
    role,
    isAuthenticated,
    isLoading,
    isPatient: role === "PATIENT",
    isDoctor: role === "DOCTOR",
    isNurse: role === "NURSE",
    isAdmin: role === "ADMIN",
    isSuperAdmin: role === "SUPER_ADMIN",
    updateSession: update,
  };
}
