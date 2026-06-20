import { http } from "@/lib/http";
import { tokenStorage } from "@/lib/token";

export type User = {
    id: string;
    nickname: string | null;
    phone_number: string;
    email: string;
    first_name: string;
    last_name: string;
    birth_date: string | null;
    gender: string | null;
    is_staff: boolean;
};
export type RegisterPayload = {
    nickname: string | null;
    phone_number: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
};

export type RegisterSessionResponse = {
    session_id: string;
};

type TokenResponse = {
    access: string;
    refresh: string;
};

export async function loginRequest(email: string, password: string) {
    const tokens = await http.post<TokenResponse>("/users/jwt/", {
        email,
        password,
    });

    tokenStorage.set(tokens.access, tokens.refresh);

    return getMeRequest();
}

export function getMeRequest() {
    return http.get<User>("/users/me");
}

export function logoutRequest() {
    tokenStorage.clear();
}

export async function createRegisterSession(data: RegisterPayload) {
    return http.post<RegisterSessionResponse>("/users/session/", data);
}

export async function confirmRegister(session_id: string, code: string) {
    return http.post("/users/", {
        session_id,
        code,
    });
}
