"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-10">
                <p className="text-gray-500">Загрузка...</p>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-10">
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Профиль
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Чтобы посмотреть профиль, войдите в аккаунт.
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

    const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                    Мой профиль
                </h1>

                <Link
                    href="/profile/edit"
                    className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                >
                    Редактировать
                </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 text-2xl font-bold text-white">
                        {(user.first_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {fullName || user.nickname || "Пользователь"}
                        </h2>

                        <p className="text-sm text-gray-500">
                            {user.is_staff ? "Администратор" : "Покупатель"}
                        </p>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    <ProfileRow label="Email" value={user.email} />
                    <ProfileRow label="Телефон" value={user.phone_number} />
                    <ProfileRow label="Никнейм" value={user.nickname} />
                    <ProfileRow label="Имя" value={user.first_name} />
                    <ProfileRow label="Фамилия" value={user.last_name} />
                    <ProfileRow label="Дата рождения" value={formatDate(user.birth_date)} />
                    <ProfileRow label="Пол" value={formatGender(user.gender)} />
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                        href="/profile/change-email"
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        Изменить почту
                    </Link>

                    <Link
                        href="/profile/change-password"
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        Изменить пароль
                    </Link>
                </div>
            </div>
        </main>
    );
}

function ProfileRow({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-4">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-right text-sm font-medium text-gray-900">
                {value || "Не указано"}
            </span>
        </div>
    );
}

function formatDate(value?: string | null) {
    if (!value) return "Не указано";

    return new Date(value).toLocaleDateString("ru-RU");
}

function formatGender(value?: string | null) {
    if (!value) return "Не указано";

    if (value === "male") return "Мужской";
    if (value === "female") return "Женский";

    return value;
}