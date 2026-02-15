export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  email_verified?: boolean;
  plan_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  avatar_url?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}
