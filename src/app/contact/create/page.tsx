"use client";

import { useRouter } from "next/navigation";
import { http } from "@/lib/http";
import { useAuth } from "@/context/AuthContext";
import ContactForm from "@/app/components/contact/ContactForm";

export default function CreateContactPage() {
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
                Создать контакты
            </h1>

            <ContactForm
                submitText="Создать"
                onSubmit={async (values) => {
                    await http.post("/about-us/contact/", values);
                    router.push("/contact");
                }}
            />
        </main>
    );
}