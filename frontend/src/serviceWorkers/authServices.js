import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/auth";

/**
 * Register a new user
 * @param {Object} userData - { uname, password, role }
 */
export const register = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/register/`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.error("Register API error:", error);
    throw new Error(
      error.response?.data?.uname?.[0] ||
        error.response?.data?.error ||
        "Registration failed"
    );
  }
};

/**
 * Login user and store tokens
 * @param {Object} credentials - { uname, password }
 */
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/login/`, credentials, {
      headers: { "Content-Type": "application/json" },
    });
    const data = response.data;

    // Store tokens
    if (data.access) localStorage.setItem("caseperl_access_token", data.access);
    if (data.refresh) localStorage.setItem("caseperl_refresh_token", data.refresh);

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.detail ||
        "Login failed"
    );
  }
};

/**
 * Logout user and clear tokens
 */
export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem("caseperl_refresh_token");
    const accessToken = localStorage.getItem("caseperl_access_token");

    const response = await axios.post(
      `${BASE_URL}/logout/`,
      { refresh: refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Clear tokens
    localStorage.removeItem("caseperl_access_token");
    localStorage.removeItem("caseperl_refresh_token");

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    localStorage.removeItem("caseperl_access_token");
    localStorage.removeItem("caseperl_refresh_token");
    throw new Error(
      error.response?.data?.error || "Logout failed"
    );
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  try {
    const accessToken = localStorage.getItem("caseperl_access_token");
    const response = await axios.get(`${BASE_URL}/me/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Get current user API error:", error);
    throw new Error(
      error.response?.data?.error || "Failed to get current user"
    );
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem("caseperl_refresh_token");
    const response = await axios.post(
      `${BASE_URL}/token/refresh/`,
      { refresh },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = response.data;

    if (data.access) localStorage.setItem("caseperl_access_token", data.access);
    if (data.refresh) localStorage.setItem("caseperl_refresh_token", data.refresh);

    return response;
  } catch (error) {
    console.error("Token refresh API error:", error);
    localStorage.removeItem("caseperl_access_token");
    localStorage.removeItem("caseperl_refresh_token");
    throw new Error(
      error.response?.data?.error || "Token refresh failed"
    );
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("caseperl_access_token");
  return !!token;
};

/**
 * Get stored access token
 */
export const getAccessToken = () => localStorage.getItem("caseperl_access_token");

/**
 * Get stored refresh token
 */
export const getRefreshToken = () => localStorage.getItem("caseperl_refresh_token");
