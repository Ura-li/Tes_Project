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

/**
 * @typedef {Object} MyJwtPayload
 * @property {number} id
 * @property {string} email
 * @property {string} role
 * @property {string} name
 * @property {string} avatar
 * @property {number} iat
 * @property {number} exp
 */

/**
 * @returns {MyJwtPayload | null}
 */
export function getUserFromToken(tokenOverride) {
  const token = tokenOverride ?? getToken();
  if (!token) return null;

  try {
    /** @type {MyJwtPayload} */
    const decoded = jwtDecode(token);

    if (isTokenExpired(decoded)) {
      clearToken();
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    clearToken();
    return null;
  }
}

