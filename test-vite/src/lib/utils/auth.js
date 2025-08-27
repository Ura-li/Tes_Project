import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded; // isinya: { id, email, role, iat, exp }
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
