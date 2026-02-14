import type { Timestamp } from "firebase/firestore";

export type PlanType = "free" | "pro" | "premium";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  plan: PlanType;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  conversionsUsed: number;
  conversionsThisMonth: number;
  totalTokensUsed: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Conversion {
  id: string;
  userId: string;
  inputCode: string;
  inputFileName: string | null;
  inputLineCount: number;
  outputNotebook: string;
  claudeModel: string;
  claudeInputTokens: number;
  claudeOutputTokens: number;
  status: "processing" | "completed" | "failed";
  errorMessage: string | null;
  processingTimeMs: number;
  createdAt: Timestamp;
}

export interface ConvertRequest {
  code: string;
  fileName?: string;
}

export interface ConvertResponse {
  notebook: Record<string, unknown>;
  conversionId: string;
  inputTokens: number;
  outputTokens: number;
  processingTimeMs: number;
}

export interface ApiError {
  error: string;
  code: string;
}
