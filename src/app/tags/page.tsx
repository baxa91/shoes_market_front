"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { http } from "@/lib/http";

type Tag = {
    id: string;
    name: string;
    type: string;
};

export default function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadTags() {
        setLoading(true);
        setError("");

        try {
            const data = await http.get<Tag[]>("/products/tags/");
            setTags(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки тэгов");
        } finally {
            setLoading(false);
        }
    }

    async function deleteTag(tagId: string) {
        const ok = confirm("Удалить этот тэг?");
        if (!ok) return;

        try {
            await http.delete(`/products/tags/${tagId}/`);
            setTags((prev) => prev.filter((tag) => tag.id !== tagId));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка удаления тэга");
        }
    }

    useEffect(() => {
        loadTags();
    }, []);

    return (
        <div className="flex min-h-full justify-center px-4 py-10">
            <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Тэги
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Управление тэгами товаров
                        </p>
                    </div>

                    <Link
                        href="/create_tag"
                        className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                    >
                        Создать
                    </Link>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-sm text-gray-500">Загрузка...</p>
                ) : (
                    <div className="space-y-2">
                        {tags.map((tag) => (
                            <div
                                key={tag.id}
                                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {tag.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Тип: {tag.type}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/edit_tag/${tag.id}`}
                                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Редактировать
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => deleteTag(tag.id)}
                                        className="rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}