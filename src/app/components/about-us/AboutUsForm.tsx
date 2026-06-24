"use client";

import { FormEvent, useState } from "react";

type AboutUsFormValues = {
    title: string;
    subtitle: string;
    content: string;
};

type Props = {
    initialValues?: Partial<AboutUsFormValues>;
    submitText: string;
    onSubmit: (values: AboutUsFormValues) => Promise<void>;
};

export default function AboutUsForm({
    initialValues,
    submitText,
    onSubmit,
}: Props) {
    const [title, setTitle] = useState(initialValues?.title ?? "");
    const [subtitle, setSubtitle] = useState(initialValues?.subtitle ?? "");
    const [content, setContent] = useState(initialValues?.content ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim() || !content.trim()) {
            setError("Заполните заголовок и текст");
            return;
        }

        try {
            setLoading(true);

            await onSubmit({
                title: title.trim(),
                subtitle: subtitle.trim(),
                content: content.trim(),
            });
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    "Не удалось сохранить страницу"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Заголовок
                </label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                    placeholder="О нас"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Подзаголовок
                </label>
                <input
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                    placeholder="Например: обувь для всей семьи"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Текст
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                    placeholder="Расскажите о магазине..."
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
                {loading ? "Сохранение..." : submitText}
            </button>
        </form>
    );
}