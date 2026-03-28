const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

type RequestOptions = {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
};

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string) {
    accessToken = token;
}

export function clearAccessToken() {
    accessToken = null;
}

export function getAccessToken() {
  return accessToken;
}

function isFormDataBody(body: unknown): body is FormData {
    return typeof FormData !== "undefined" && body instanceof FormData;
}

export async function refreshAccessToken(): Promise<string | null> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        try {
            const res = await fetch(`${API_URL}/auth/refresh`, {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) {
                clearAccessToken();
                return null;
            }

            const data = await res.json();
            setAccessToken(data.accessToken);
            return data.accessToken;
        } catch {
            clearAccessToken();
            return null;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

export async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = {},
    retry = true,
): Promise<T> {
    const { method = "GET", body } = options;
    const useFormData = isFormDataBody(body);

    const headers: Record<string, string> = {};

    if (!useFormData && body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        credentials: "include",
        headers,
        body:
            body === undefined
                ? undefined
                : useFormData
                    ? body
                    : JSON.stringify(body),
    });

    if (response.status === 401 && retry) {
        const newToken = await refreshAccessToken();

        if (newToken) {
            return apiRequest<T>(endpoint, options, false);
        }

        clearAccessToken();
        throw new Error("Unauthorized");
    }

    if (response.status === 204) {
        return null as T;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            Array.isArray(data?.message)
                ? data.message.join(", ")
                : data?.message || "Request failed"
        );
    }

    return data as T;
}