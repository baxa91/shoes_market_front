"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { http } from "@/lib/http";
import { updateMeRequest } from "@/services/auth.service";

export default function EditProfilePage() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        nickname: user?.nickname ?? "",
        first_name: user?.first_name ?? "",
        last_name: user?.last_name ?? "",
        phone_number: user?.phone_number ?? "",
        birth_date: user?.birth_date ?? "",
        gender: user?.gender ?? "",
    });

    if (!user) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-10">
                <p>Необходимо авторизоваться</p>
            </main>
        );
    }

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await updateMeRequest({
                nickname: form.nickname || null,
                first_name: form.first_name || null,
                last_name: form.last_name || null,
                phone_number: "+" + form.phone_number.replace(/\D/g, ""),
                birth_date: form.birth_date || null,
                gender: form.gender || null,
            });

            await refreshUser();

        router.push("/profile");
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                err?.message ||
                "Не удалось обновить профиль"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="mb-6 text-3xl font-bold text-gray-900">
                Редактирование профиля
            </h1>

            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5"
            >
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <Input
                    label="Никнейм"
                    name="nickname"
                    value={form.nickname}
                    onChange={handleChange}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                        label="Имя"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                    />

                    <Input
                        label="Фамилия"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                    />
                </div>

                <Input
                    label="Телефон"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                />

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Дата рождения
                    </label>

                    <input
                        type="date"
                        name="birth_date"
                        value={form.birth_date ?? ""}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Пол
                    </label>

                    <select
                        name="gender"
                        value={form.gender ?? ""}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                    >
                        <option value="">Не указан</option>
                        <option value="male">Мужской</option>
                        <option value="female">Женский</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-60"
                >
                    {loading ? "Сохраняем..." : "Сохранить"}
                </button>
            </form>
        </main>
    );
}

type InputProps = {
    label: string;
    name: string;
    value: string;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
};

function Input({
    label,
    name,
    value,
    onChange,
}: InputProps) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
            />
        </div>
    );
}