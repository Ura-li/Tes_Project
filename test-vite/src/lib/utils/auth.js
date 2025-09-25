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

export function isTokenExpired(decodedToken) {
  if (!decodedToken || typeof decodedToken.exp !== "number") {
    return false;
  }

  return decodedToken.exp * 1000 <= Date.now();
}

export function getUserFromToken(tokenOverride) {
  const token = tokenOverride ?? getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    if (isTokenExpired(decoded)) {
      clearToken();
      return null;
    }

    return decoded; // berisi: { id, email, role, iat, exp }
  } catch (error) {
    console.error("Failed to decode token:", error);
    clearToken();
    return null;
  }
}
