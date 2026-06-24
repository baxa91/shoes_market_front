"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { http } from "@/lib/http";
import { useRouter } from "next/navigation";

type Step = "email" | "code";

export default function ChangeEmailPage() {
    const router = useRouter();
    const { user, loading: authLoading, refreshUser } = useAuth();

    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [code, setCode] = useState("");

    const [secondsLeft, setSecondsLeft] = useState(300);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (step !== "code") return;

        setSecondsLeft(300);

        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [step, sessionId]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const timerText = `${minutes}:${String(seconds).padStart(2, "0")}`;

    async function handleSendCode(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await http.post<{ session_id: string }>(
                "/users/change-email/session/",
                {
                    email: email.trim(),
                }
            );

            setSessionId(data.session_id);
            setStep("code");
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Не удалось отправить код"
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleConfirm(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await http.patch("/users/change-email/", {
                session_id: sessionId,
                code,
            });

            await refreshUser();
            router.push("/profile");
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Не удалось изменить почту"
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
                        Изменение почты
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
                Изменение почты
            </h1>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {step === "email" ? (
                    <form onSubmit={handleSendCode} className="space-y-5">
                        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                            Текущая почта:{" "}
                            <span className="font-medium text-gray-900">
                                {user.email}
                            </span>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Новая почта
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                required
                                placeholder="new-email@mail.com"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-60"
                        >
                            {loading ? "Отправляем..." : "Отправить код"}
                        </button>

                        <Link
                            href="/profile"
                            className="block text-center text-sm text-gray-600 hover:text-gray-900 hover:underline"
                        >
                            Назад в профиль
                        </Link>
                    </form>
                ) : (
                    <form onSubmit={handleConfirm} className="space-y-5">
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                            <p className="font-medium">
                                Код отправлен на новую почту:
                            </p>
                            <p className="mt-1 font-semibold">{email}</p>
                            <p className="mt-2">
                                Если письма нет во входящих, проверьте папку
                                “Спам”.
                            </p>
                            <p className="mt-2">
                                Код действителен:{" "}
                                <span className="font-semibold">
                                    {timerText}
                                </span>
                            </p>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Код подтверждения
                            </label>
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="123456"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-center text-lg tracking-widest outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                            />
                        </div>

                        {secondsLeft === 0 && (
                            <p className="text-sm text-red-600">
                                Срок действия кода истёк. Вернитесь назад и
                                отправьте код заново.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || secondsLeft === 0}
                            className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-60"
                        >
                            {secondsLeft === 0
                                ? "Код истёк"
                                : loading
                                  ? "Проверяем..."
                                  : "Подтвердить"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setStep("email");
                                setCode("");
                                setSessionId("");
                            }}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Назад
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}