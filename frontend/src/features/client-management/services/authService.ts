import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase authentication environment variables are missing.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'customer' | 'vendor';
};

let currentUserCache: { user: AuthUser; expiresAt: number } | null = null;
let currentUserRequest: Promise<AuthUser> | null = null;

function toAuthUser(user: { id: string; email?: string; user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown> }): AuthUser {
  const metadata = user.app_metadata?.role ? user.app_metadata : user.user_metadata ?? {};
  const metadataRole = typeof metadata.role === 'string' ? metadata.role : '';
  const role = metadataRole === 'admin' ? 'admin' : metadataRole === 'vendor' ? 'vendor' : 'customer';
  const name = typeof user.user_metadata?.full_name === 'string'
    ? user.user_metadata.full_name
    : user.email?.split('@')[0] ?? user.id;
  return {
    id: user.id,
    name,
    username: user.email?.split('@')[0] ?? user.id,
    email: user.email ?? '',
    role,
  };
}

async function resolveBackendRole(fallback: AuthUser) {
  const token = await getAccessToken();
  if (!token) return fallback;
  const response = await fetch(`${apiBaseUrl}/auth/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return fallback;
  const backendUser = await response.json() as { role?: AuthUser['role'] };
  return backendUser.role ? { ...fallback, role: backendUser.role } : fallback;
}

async function getCurrentUser(): Promise<AuthUser> {
  if (currentUserCache && currentUserCache.expiresAt > Date.now()) return currentUserCache.user;
  if (currentUserRequest) return currentUserRequest;
  currentUserRequest = (async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw new Error('Not authenticated.');
    const user = await resolveBackendRole(toAuthUser(data.user));
    currentUserCache = { user, expiresAt: Date.now() + 30_000 };
    return user;
  })();
  try {
    return await currentUserRequest;
  } finally {
    currentUserRequest = null;
  }
}

export const authApi = {
  async login(email: string, password: string, expectedRole?: AuthUser['role']) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw new Error(error?.message ?? 'Unable to sign in.');
    const user = await resolveBackendRole(toAuthUser(data.user));
    currentUserCache = { user, expiresAt: Date.now() + 30_000 };
    if (expectedRole && user.role !== expectedRole) {
      await supabase.auth.signOut();
      throw new Error(`This account is not registered as ${expectedRole}.`);
    }
    return user;
  },
  async register(email: string, password: string, role: 'customer' | 'vendor', fullName: string) {
    const lastAttempt = Number(window.localStorage.getItem('wedpilot_signup_attempt') ?? '0');
    if (Date.now() - lastAttempt < 60_000) {
      throw new Error('Please wait one minute before trying registration again.');
    }
    window.localStorage.setItem('wedpilot_signup_attempt', String(Date.now()));
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role, full_name: fullName.trim() } },
    });
    if (error) {
      if (error.message.toLowerCase().includes('rate limit')) {
        throw new Error('Supabase email rate limit reached. Wait a few minutes, or disable email confirmation in Supabase Auth while testing.');
      }
      throw new Error(error.message);
    }
    if (!data.user) throw new Error('Unable to create account.');
    if (!data.session) throw new Error('Account created. Check your email to confirm your account, then sign in.');
    return resolveBackendRole(toAuthUser(data.user));
  },
  async me() {
    return getCurrentUser();
  },
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    currentUserCache = null;
  },
};

export async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
