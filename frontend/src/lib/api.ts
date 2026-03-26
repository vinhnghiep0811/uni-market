const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

type RequestOptions = {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
};

let accessToken: string | null = null;

export function setAccessToken(token: string) {
    accessToken = token;
}

export function clearAccessToken() {
    accessToken = null;
}

function isFormDataBody(body: unknown): body is FormData {
    return typeof FormData !== "undefined" && body instanceof FormData;
}

// 🔥 gọi refresh token
async function refreshAccessToken(): Promise<string | null> {
    try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
        });

        if (!res.ok) return null;

        const data = await res.json();
        setAccessToken(data.accessToken);

        return data.accessToken;
    } catch {
        return null;
    }
}

export async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = {},
    retry = true, // 🔥 tránh loop vô hạn
): Promise<T> {
    const { method = "GET", body } = options;
    const useFormData = isFormDataBody(body);

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        credentials: "include",
        headers: {
            ...(!useFormData && body !== undefined
                ? { "Content-Type": "application/json" }
                : {}),
            ...(accessToken && {
                Authorization: `Bearer ${accessToken}`,
            }),
        },
        body:
            body === undefined
                ? undefined
                : useFormData
                    ? body
                    : JSON.stringify(body),
    });

    // 🔥 nếu token hết hạn
    if (response.status === 401 && retry) {
        const newToken = await refreshAccessToken();

        if (newToken) {
            // 🔁 retry request với token mới
            return apiRequest<T>(endpoint, options, false);
        } else {
            clearAccessToken();
            throw new Error("Unauthorized");
        }
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
