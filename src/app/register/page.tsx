"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createRegisterSession, confirmRegister } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const [step, setStep] = useState<"form" | "code">("form");
    const [sessionId, setSessionId] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [secondsLeft, setSecondsLeft] = useState(300);

    const [form, setForm] = useState({
        nickname: "",
        phone_number: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
    });

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

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleCreateSession(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await createRegisterSession({
                ...form,
                nickname: form.nickname || null,
                phone_number: "+" + form.phone_number.replace(/\D/g, ""),
            });

            setSessionId(data.session_id);
            setStep("code");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка регистрации");
        } finally {
            setLoading(false);
        }
    }

    async function handleConfirm(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await confirmRegister(sessionId, code);
            router.push("/login");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Неверный код");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-full items-center justify-center px-4 py-10">
            <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Регистрация
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        {step === "form"
                            ? "Создайте аккаунт"
                            : "Введите код подтверждения"}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {step === "form" ? (
                    <form onSubmit={handleCreateSession} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Никнейм
                            </label>
                            <input
                                name="nickname"
                                value={form.nickname}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Имя
                                </label>
                                <input
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    placeholder="John"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Фамилия
                                </label>
                                <input
                                    name="last_name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Телефон
                            </label>
                            <input
                                name="phone_number"
                                value={form.phone_number}
                                onChange={handleChange}
                                placeholder="+77777777777"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                type="email"
                                placeholder="example@mail.com"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Пароль
                            </label>
                            <input
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                type="password"
                                placeholder="Минимум 8 символов"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Отправляем код..." : "Зарегистрироваться"}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Уже есть аккаунт?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-gray-800 hover:underline"
                            >
                                Войти
                            </Link>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleConfirm} className="space-y-4">
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                            <p className="font-medium">
                                Код подтверждения отправлен на вашу почту.
                            </p>
                            <p className="mt-1">
                                Проверьте папку “Входящие”. Если письма нет, посмотрите папки
                                “Спам” или “Промоакции”.
                            </p>
                            <p className="mt-2">
                                Код действителен:{" "}
                                <span className="font-semibold">{timerText}</span>
                            </p>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Код подтверждения
                            </label>
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="444444"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-center text-lg tracking-widest outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                            />
                            {secondsLeft === 0 && (
                                <p className="text-sm text-red-600">
                                    Срок действия кода истёк. Вернитесь назад и отправьте код заново.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || secondsLeft === 0}
                            className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {secondsLeft === 0
                                ? "Код истёк"
                                : loading
                                  ? "Проверяем..."
                                  : "Подтвердить"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep("form")}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Назад
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}