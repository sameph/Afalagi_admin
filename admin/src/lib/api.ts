const API = (import.meta as any).env.VITE_API_URL as string;

export type Role = 'user' | 'admin';
export type PostType = 'lost_person' | 'found_person' | 'lost_item' | 'found_item';
export type PostStatus = 'open' | 'closed' | 'resolved';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: Role;
  isVerified: boolean;
  status?: 'active' | 'banned';
  lastLogin?: string;
  createdAt?: string;
}

export interface Post {
  _id: string;
  userId: { _id: string; name: string; email: string; role: Role } | string;
  type: PostType;
  title: string;
  description: string;
  personName?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  itemName?: string;
  category?: string;
  brand?: string;
  color?: string;
  images?: { url: string; caption?: string; uploadedAt?: string }[];
  location?: { latitude?: number; longitude?: number; address?: string; city?: string; region?: string; country?: string };
  lastSeenDate?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  rewardAmount?: number;
  status: PostStatus;
  isPublic: boolean;
  createdAt?: string;
}

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error(`Unexpected response: ${res.status} ${text}`);
  }
  const data = await res.json();
  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }
  return data as T;
}

export async function fetchUsers(params?: { q?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set('q', params.q);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return fetchJSON<{ success: true; page: number; total: number; totalPages: number; users: User[] }>(`/api/admin/users${query}`);
}

export async function fetchLostReports(params?: { q?: string; status?: PostStatus; page?: number; limit?: number; type?: string }) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set('q', params.q);
  if (params?.status) qs.set('status', params.status);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.type) qs.set('type', params.type);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return fetchJSON<{ success: true; page: number; total: number; totalPages: number; posts: Post[] }>(`/api/admin/reports/lost${query}`);
}

export async function fetchFoundReports(params?: { q?: string; status?: PostStatus; page?: number; limit?: number; type?: string }) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set('q', params.q);
  if (params?.status) qs.set('status', params.status);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.type) qs.set('type', params.type);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return fetchJSON<{ success: true; page: number; total: number; totalPages: number; posts: Post[] }>(`/api/admin/reports/found${query}`);
}

export async function fetchItems(params?: { q?: string; status?: PostStatus; page?: number; limit?: number; type?: string }) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set('q', params.q);
  if (params?.status) qs.set('status', params.status);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.type) qs.set('type', params.type);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return fetchJSON<{ success: true; page: number; total: number; totalPages: number; posts: Post[] }>(`/api/admin/items${query}`);
}

export async function fetchAdminPosts(params?: { q?: string; status?: PostStatus; page?: number; limit?: number; type?: string }) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set('q', params.q);
  if (params?.status) qs.set('status', params.status);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.type) qs.set('type', params.type);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return fetchJSON<{ success: true; page: number; total: number; totalPages: number; posts: Post[] }>(`/api/admin/posts${query}`);
}
