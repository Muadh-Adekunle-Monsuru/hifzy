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

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const accessToken = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  } as Record<string, string>;

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const errorResponse = response.clone();
    try {
      const errorData = await errorResponse.json();

      if (errorData.detail === "token_expired") {
        if (isRefreshing && refreshPromise) {
          const success = await refreshPromise;
          if (success) {
            const newToken = getToken();
            const retryHeaders = {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            };
            return fetch(url, { ...options, headers: retryHeaders });
          }
          return response;
        }

        isRefreshing = true;
        refreshPromise = (async () => {
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            isRefreshing = false;
            refreshPromise = null;
            return false;
          }

          try {
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
              return true;
            }
          } catch (e) {
            console.error("Refresh attempt failed", e);
          } finally {
            isRefreshing = false;
            refreshPromise = null;
          }
          return false;
        })();

        const success = await refreshPromise;
        if (success) {
          const newToken = getToken();
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          };
          return fetch(url, { ...options, headers: retryHeaders });
        } else {
          // If refresh fails completely, logout
          await logout();
          return response;
        }
      } else if (
        errorData.detail === "invalid_token" ||
        errorData.detail === "invalid_refresh_token"
      ) {
        console.log("invalid token, ", errorData);
        await logout();
        return response;
      }
    } catch (e) {
      return response;
    }
  }

  return response;
};
