import { API_CONFIG } from './constants';
import { fetchWithAuth } from './utils/api-helpers';

export async function getAuthToken(): Promise<string> {
  try {
    const data = await fetchWithAuth(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}`,
      {
        method: 'POST',
        body: JSON.stringify(API_CONFIG.CREDENTIALS),
      }
    );
    return data.token;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}