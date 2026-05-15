export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const logout = async () => {
  const token = getToken();
  if (token) {
    try {
      await fetch("https://quran-be-59779bf2.fastapicloud.dev/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  }
  clearTokens();
  window.location.href = "/login";
};

/**
 * Enhanced fetch wrapper that handles:
 * 1. Automatic Authorization header injection
 * 2. Token expiration detection and refresh
 * 3. Automatic retry of the original request after refresh
 * 4. Redirection to login on invalid tokens
 */
export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const accessToken = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  } as Record<string, string>;

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Clone response to read body without consuming the original stream
    const errorResponse = response.clone();
    try {
      const errorData = await errorResponse.json();

      if (errorData.detail === "token_expired") {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          // await logout();
          console.log("token expired but no refresh token");
          return response;
        }

        // Attempt to refresh the token
        const refreshResponse = await fetch(
          "https://quran-be-59779bf2.fastapicloud.dev/auth/refresh",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          },
        );

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          setTokens(data.access_token, data.refresh_token);

          // Retry the original request with the new token
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${data.access_token}`,
          };
          return fetch(url, { ...options, headers: retryHeaders });
        } else {
          // If refresh fails, log out
          // await logout();
          console.log("refresh token expired, cant retry");
          return refreshResponse;
        }
      } else if (
        errorData.detail === "invalid_token" ||
        errorData.detail === "invalid_refresh_token"
      ) {
        // await logout();
        console.log("invalid token, ", errorData);
        return response;
      }
    } catch (e) {
      // If JSON parsing fails, just return the original 401 response
      return response;
    }
  }

  return response;
};
