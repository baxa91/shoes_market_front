"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { http } from "@/lib/http";
import { useAuth } from "@/context/AuthContext";
import ReactMarkdown from "react-markdown";

type AboutImage = {
    image: string;
    sort_order: number;
};

type AboutUs = {
    title: string;
    subtitle?: string | null;
    content: string;
    images: AboutImage[];
};

export default function AboutUsPage() {
    const { user } = useAuth();

    const [about, setAbout] = useState<AboutUs | null>(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = Boolean(user?.is_staff);

    useEffect(() => {
        const loadAbout = async () => {
            try {
                const res = await http.get<AboutUs | null>("/about-us/");
                setAbout(res);
            } catch (error: any) {
                if (error?.response?.status === 404) {
                    setAbout(null);
                }
            } finally {
                setLoading(false);
            }
        };

        loadAbout();
    }, []);

    if (loading) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-10">
                <p className="text-gray-500">Загрузка...</p>
            </main>
        );
    }

    if (!about) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-10">
                {isAdmin && (
                    <Link
                        href="/about-us/create"
                        className="inline-flex rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
                    >
                        Создать страницу “О нас”
                    </Link>
                )}
            </main>
        );
    }

    const sortedImages = [...about.images].sort(
        (a, b) => a.sort_order - b.sort_order
    );

    return (
        <main className="mx-auto max-w-5xl px-4 py-10">
            {isAdmin && (
                <div className="mb-6 flex justify-end">
                    <Link
                        href="/about-us/edit"
                        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        Редактировать
                    </Link>
                </div>
            )}

            <section className="mx-auto max-w-3xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                    {about.title}
                </h1>

                {about.subtitle && (
                    <p className="mt-4 text-lg leading-8 text-gray-500">
                        {about.subtitle}
                    </p>
                )}
            </section>

            <section className="mx-auto mt-10 max-w-3xl rounded-3xl bg-gray-50 px-6 py-8 shadow-sm">
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900">
                    <ReactMarkdown>
                        {about.content}
                    </ReactMarkdown>
                </div>
            </section>

            {sortedImages.length > 0 && (
                <section className="mx-auto mt-12 max-w-5xl">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {sortedImages.map((image, index) => (
                            <img
                                key={index}
                                src={image.image}
                                alt=""
                                className="h-72 w-full rounded-3xl object-cover shadow-sm"
                            />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}