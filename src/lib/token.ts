export const tokenStorage = {
    getAccess() {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("access_token");
    },

    getRefresh() {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("refresh_token");
    },

    set(access: string, refresh: string) {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
    },

    clear() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    },
};