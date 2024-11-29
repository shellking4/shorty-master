import { z } from 'zod';
import { API_CONFIG } from './constants';
import { fetchWithAuth, getAuthHeader } from './utils/api-helpers';

export const loginSchema = z.object({
  identity: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const urlSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
export type ShortenRequest = z.infer<typeof urlSchema>;

export async function login(credentials: LoginCredentials) {
  return fetchWithAuth(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function shortenUrl(url: string, token: string) {
  return fetchWithAuth(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHORTEN}`, {
    method: 'POST',
    headers: getAuthHeader(token),
    body: JSON.stringify({ url }),
  });
}