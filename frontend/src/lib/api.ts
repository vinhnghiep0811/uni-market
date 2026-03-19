const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

type RequestOptions = {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
};

export async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = {},
): Promise<T> {
    const { method = "GET", body } = options;

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

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