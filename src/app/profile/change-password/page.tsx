"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { http } from "@/lib/http";
import { useAuth } from "@/context/AuthContext";

export default function ChangePasswordPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (newPassword.length < 8) {
            setError("Новый пароль должен быть минимум 8 символов");
            return;
        }

        if (newPassword !== repeatPassword) {
            setError("Новые пароли не совпадают");
            return;
        }

        setLoading(true);

        try {
            await http.patch("/users/change-password/", {
                old_password: oldPassword,
                new_password: newPassword,
            });

            setSuccess("Пароль успешно изменён");

            setOldPassword("");
            setNewPassword("");
            setRepeatPassword("");

            setTimeout(() => {
                router.push("/profile");
            }, 1200);
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

    if (authLoading) {
        return (
            <main className="mx-auto max-w-md px-4 py-10">
                <p className="text-gray-500">Загрузка...</p>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="mx-auto max-w-md px-4 py-10">
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Изменение пароля
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Сначала войдите в аккаунт.
                    </p>

                    <Link
                        href="/login"
                        className="mt-6 inline-flex rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white"
                    >
                        Войти
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-md px-4 py-10">
            <h1 className="mb-6 text-3xl font-bold text-gray-900">
                Изменение пароля
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <PasswordInput
                    label="Текущий пароль"
                    value={oldPassword}
                    onChange={setOldPassword}
                    placeholder="Введите текущий пароль"
                />

                <PasswordInput
                    label="Новый пароль"
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder="Минимум 8 символов"
                />

                <PasswordInput
                    label="Повторите новый пароль"
                    value={repeatPassword}
                    onChange={setRepeatPassword}
                    placeholder="Повторите новый пароль"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Сохраняем..." : "Сохранить пароль"}
                </button>

                <Link
                    href="/profile"
                    className="block text-center text-sm text-gray-600 hover:text-gray-900 hover:underline"
                >
                    Назад в профиль
                </Link>
            </form>
        </main>
    );
}

function PasswordInput({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                type="password"
                minLength={8}
                required
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
            />
        </div>
    );
}