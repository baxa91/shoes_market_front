"use client";

import { useEffect, useState } from "react";
import { http } from "@/lib/http";

type TagFormProps = {
    mode: "create" | "edit";
    tagId?: string;
};

type Tag = {
    id: string;
    name: string;
    type: string;
};

export default function TagForm({ mode, tagId }: TagFormProps) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [type, setType] = useState("");

    useEffect(() => {
        if (mode !== "edit" || !tagId) return;

        async function loadTag() {
            try {
                const tag = await http.get<Tag>(`/products/tags/${tagId}/`);
                setName(tag.name);
                setType(tag.type);
            } catch {
                setError("Не удалось загрузить тэг");
            }
        }

        loadTag();
    }, [mode, tagId]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Введите название тэга");
            return;
        }
        if (!type.trim()) {
            setError("Введите тип тэга");
            return;
        }

        setLoading(true);

        try {
            if (mode === "create") {
                await http.post("/products/tags/", {
                    name: name.trim(),
                    type: type.trim(),
                });

                setSuccess("Тэг успешно создан");
                setName("");
                setType("");

            } else {
                await http.patch(`/products/tags/${tagId}/`, {
                    name: name.trim(),
                    type: type.trim(),
                });

                setSuccess("Тэг успешно обновлён");
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Ошибка при сохранении тэга"
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
                        {mode === "create" ? "Создать тэг" : "Редактировать тэг"}
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        {mode === "create"
                            ? "Добавьте новый тэг для товаров"
                            : "Измените название тэга"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Название тэга
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Например: Зимняя обувь"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Тип
                        </label>

                        <input
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            placeholder="Например: gender"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Сохраняем..."
                            : mode === "create"
                              ? "Создать тэг"
                              : "Сохранить изменения"}
                    </button>
                </form>
            </div>
        </div>
    );
}