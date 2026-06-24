"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { http } from "@/lib/http";
import { useAuth } from "@/context/AuthContext";
import ContactForm, {
    ContactFormValues,
} from "@/app/components/contact/ContactForm";

export default function EditContactPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [contact, setContact] = useState<ContactFormValues | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadContact() {
            try {
                const res = await http.get<ContactFormValues>(
                    "/about-us/contact/"
                );
                setContact(res);
            } finally {
                setLoading(false);
            }
        }

        loadContact();
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

    if (!contact) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-10">
                <p className="text-gray-500">Контакты не найдены</p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
                Редактировать контакты
            </h1>

            <ContactForm
                submitText="Сохранить"
                initialValues={contact}
                onSubmit={async (values) => {
                    await http.patch("/about-us/contact/", values);
                    router.push("/contact");
                }}
            />
        </main>
    );
}