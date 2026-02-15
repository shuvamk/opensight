export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  email_verified: boolean;
  github_id: string | null;
  google_id: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_id: PlanId;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  email_verified: boolean;
  plan_id: PlanId;
  created_at: string;
}

export type PlanId = 'free' | 'starter' | 'growth';

export interface AuthResponse {
  user: UserProfile;
  accessToken: string;
}

export interface RefreshToken {
  id: string;
  user_id: string;
  token_hash: string;
  device_fingerprint: string | null;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
}
