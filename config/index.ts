/**
 * ObatIn Application Configuration System
 * Centralized, validated environment configuration with role-based route definitions.
 */

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || '',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  nextAuth: {
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    secret: process.env.NEXTAUTH_SECRET || 'secret-fallback-key',
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
  },
  blockchain: {
    nodeUrl: process.env.BLOCKCHAIN_NODE_URL || 'http://localhost:8080/api/v1',
    channel: process.env.BLOCKCHAIN_CHANNEL || 'obatin-channel',
    chaincode: process.env.BLOCKCHAIN_CHAINCODE || 'emr-ledger',
    mspId: process.env.BLOCKCHAIN_USER_MSP || 'Org1MSP',
  },
};

// User Roles
export type UserRole = 'PATIENT' | 'DOCTOR' | 'NURSE' | 'ADMIN' | 'SUPER_ADMIN';

// Role-Based Access Control (RBAC) Route Configuration
export const RBAC_ROUTES = {
  // Publicly accessible paths (no auth needed)
  public: [
    '/',
    '/login',
    '/register',
    '/api/auth/signin',
    '/api/auth/signup',
    '/api/auth/session',
    '/api/auth/providers',
    '/api/auth/callback',
    '/api/auth/_log',
    '/api/auth/csrf',
  ],
  // Paths protected by role
  protected: {
    PATIENT: [
      '/dashboard/patient',
      '/dashboard/ai-assistant',
    ],
    DOCTOR: [
      '/dashboard',
      '/dashboard/patients',
      '/dashboard/appointments',
      '/dashboard/ai-assistant',
      '/dashboard/diagnosis',
    ],
    NURSE: [
      '/dashboard',
      '/dashboard/patients',
      '/dashboard/appointments',
      '/dashboard/ai-assistant',
      '/dashboard/diagnosis',
    ],
    ADMIN: [
      '/dashboard/admin',
      '/dashboard/blockchain',
      '/dashboard/api-portal',
      '/dashboard/dev/qa',
    ],
    SUPER_ADMIN: [
      '/dashboard/admin',
      '/dashboard/blockchain',
      '/dashboard/api-portal',
      '/dashboard/dev/qa',
    ],
  },
};

// Healthcare Standards (SATUSEHAT Indonesia Integration Settings)
export const SATUSEHAT_CONFIG = {
  organizationId: '10000004', // BPJS / Kemenkes Sandbox Org ID
  kemenkesAuthUrl: 'https://api-sandbox.kemkes.go.id/oauth2/v1',
  kemenkesFhirUrl: 'https://api-sandbox.kemkes.go.id/fhir-r4/v1',
};
