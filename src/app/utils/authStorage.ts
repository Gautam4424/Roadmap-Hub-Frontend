export interface User {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
}

const ACCESS_TOKEN_KEY = 'sf_access_token';
const REFRESH_TOKEN_KEY = 'sf_refresh_token';
const USER_DATA_KEY = 'sf_user_data';

const API_BASE_URL = 'http://localhost:8001/api/v1/auth';

export const getCurrentAuthUser = (): User | null => {
  const userStr = localStorage.getItem(USER_DATA_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);

    // Fetch user details
    const user = await fetchUserDetails(data.access_token);
    if (user) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const register = async (username: string, email: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);

    // Fetch user details
    const user = await fetchUserDetails(data.access_token);
    if (user) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  } catch (error) {
    console.error('Register error:', error);
    return null;
  }
};

const fetchUserDetails = async (token: string): Promise<User | null> => {
  try {
    const validateRes = await fetch(`${API_BASE_URL}/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!validateRes.ok) return null;
    const valData = await validateRes.json();

    const meRes = await fetch(`${API_BASE_URL}/me`, {
      headers: { 'X-User-ID': valData.user_id },
    });
    if (!meRes.ok) return null;
    return await meRes.json();
  } catch {
    return null;
  }
};

export const logout = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};
