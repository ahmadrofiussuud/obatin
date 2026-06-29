import { UserRole } from "@/config";

// 1. User Types
export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string | null;
}

// 2. Chat / AI Types
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AIConsultationSession {
  id: string;
  userId: string;
  sessionTitle: string;
  chatHistory: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// 3. EMR / Prescription Types
export interface MedicationEntry {
  name: string;
  quantity: number;
  dosage: string;      // e.g. 500mg
  frequency: string;   // e.g. 3x1 (tiga kali sehari)
}

export interface ClinicalAuditLog {
  id: string;
  medicalRecordId: string;
  action: "CREATE" | "UPDATE" | "REVOKE";
  recordHash: string;
  transactionHash: string;
  blockNumber: number;
  signerId: string;
  timestamp: Date;
}
