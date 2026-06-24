"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { http } from "@/lib/http";
import { useAuth } from "@/context/AuthContext";
import AboutUsForm from "@/app/components/about-us/AboutUsForm";
import AboutUsImages from "@/app/components/about-us/AboutUsImages";

type AboutUs = {
    title: string;
    subtitle?: string | null;
    content: string;
    images: {
        image: string;
        sort_order: number;
    }[];
};

export default function EditAboutUsPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [about, setAbout] = useState<AboutUs | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAbout = async () => {
            try {
                const res = await http.get<AboutUs>("/about-us/");
                setAbout(res);
            } finally {
                setLoading(false);
            }
        };

        loadAbout();
    }, []);

    if (!user?.is_staff) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-10">
                <p className="text-gray-500">Доступ запрещён</p>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-10">
                <p className="text-gray-500">Загрузка...</p>
            </main>
        );
    }

    if (!about) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-10">
                <p className="text-gray-500">Страница “О нас” не найдена</p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
                Редактировать страницу “О нас”
            </h1>

            <AboutUsForm
                submitText="Сохранить"
                initialValues={{
                    title: about.title,
                    subtitle: about.subtitle ?? "",
                    content: about.content,
                }}
                onSubmit={async (values) => {
                    await http.patch("/about-us/", values);
                    router.push("/about-us");
                }}
            />
            <AboutUsImages
                images={about.images}
                onRefresh={async () => {
                    const res = await http.get<AboutUs>("/about-us/");
                    setAbout(res);
                }}
            />
        </main>
    );
}