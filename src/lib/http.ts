import { tokenStorage } from "@/lib/token";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type HttpOptions = {
    headers?: HeadersInit;
};

async function request<T>(
    url: string,
    method: string,
    body?: unknown,
    options?: HttpOptions
): Promise<T> {
    const access = tokenStorage.getAccess();

    const res = await fetch(`${API_URL}${url}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(access ? { Authorization: `Bearer ${access}` } : {}),
            ...options?.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        let message = "Ошибка запроса";

        try {
            const error = await res.json();
            message = error.detail || error.message || message;
        } catch {}

        throw new Error(message);
    }

    if (res.status === 204) {
        return null as T;
    }

    return res.json();
}

export const http = {
    get<T>(url: string, options?: HttpOptions) {
        return request<T>(url, "GET", undefined, options);
    },

    post<T>(url: string, body?: unknown, options?: HttpOptions) {
        return request<T>(url, "POST", body, options);
    },

    put<T>(url: string, body?: unknown, options?: HttpOptions) {
        return request<T>(url, "PUT", body, options);
    },

    patch<T>(url: string, body?: unknown, options?: HttpOptions) {
        return request<T>(url, "PATCH", body, options);
    },

    delete<T>(url: string, options?: HttpOptions) {
        return request<T>(url, "DELETE", undefined, options);
    },
};