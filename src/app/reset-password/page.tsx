"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { http } from "@/lib/http";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setSuccess(false);

        if (!token) {
            setError("Ссылка восстановления некорректная");
            return;
        }

        if (password.length < 8) {
            setError("Пароль должен быть минимум 8 символов");
            return;
        }

        if (password !== passwordRepeat) {
            setError("Пароли не совпадают");
            return;
        }

        setLoading(true);

        try {
            await http.post("/users/reset-password/", {
                token,
                password,
            });

            setSuccess(true);

            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Не удалось изменить пароль"
            );
        } finally {
            setLoading(false);
        }
    }

    if (!token) {
        return (
            <div className="flex min-h-full items-center justify-center px-4 py-10">
                <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Некорректная ссылка
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Ссылка восстановления пароля отсутствует или повреждена.
                    </p>

                    <Link
                        href="/forgot-password"
                        className="mt-6 inline-flex rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
                    >
                        Запросить новую ссылку
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-full items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Новый пароль
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Придумайте новый пароль для аккаунта
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        Пароль успешно изменён. Сейчас перенаправим на вход.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Новый пароль
                        </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            minLength={8}
                            required
                            placeholder="Минимум 8 символов"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Повторите пароль
                        </label>
                        <input
                            value={passwordRepeat}
                            onChange={(e) => setPasswordRepeat(e.target.value)}
                            type="password"
                            minLength={8}
                            required
                            placeholder="Повторите пароль"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Сохраняем..." : "Сменить пароль"}
                    </button>

                    <Link
                        href="/login"
                        className="block text-center text-sm text-gray-600 hover:text-gray-900 hover:underline"
                    >
                        Вернуться ко входу
                    </Link>
                </form>
            </div>
        </div>
    );
}