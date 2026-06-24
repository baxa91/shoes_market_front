"use client";

import Link from "next/link";
import { useState } from "react";
import { http } from "@/lib/http";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            await http.post("/users/forgot-password/", {
                email: email.trim(),
            });

            setSuccess(true);
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Не удалось отправить ссылку"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-full items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Восстановление пароля
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Введите email, и мы отправим ссылку для смены пароля
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        Ссылка для восстановления отправлена на почту. Если письма нет во входящих, проверьте папку “Спам”.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                            placeholder="example@mail.com"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Отправляем..." : "Отправить ссылку"}
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