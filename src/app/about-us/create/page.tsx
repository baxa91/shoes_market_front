"use client";

import { useRouter } from "next/navigation";
import { http } from "@/lib/http";
import { useAuth } from "@/context/AuthContext";
import AboutUsForm from "@/app/components/about-us/AboutUsForm";

export default function CreateAboutUsPage() {
    const router = useRouter();
    const { user } = useAuth();

    if (!user?.is_staff) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-10">
                <p className="text-gray-500">Доступ запрещён</p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
                Создать страницу “О нас”
            </h1>

            <AboutUsForm
                submitText="Создать"
                onSubmit={async (values) => {
                    await http.post("/about-us/", values);
                    router.push("/about-us");
                }}
            />
        </main>
    );
}