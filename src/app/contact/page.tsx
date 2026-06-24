"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { http } from "@/lib/http";
import { useAuth } from "@/context/AuthContext";

type ContactPhone = {
    phone: string;
    title?: string | null;
    is_whatsapp: boolean;
    sort_order: number;
};

type ContactPage = {
    instagram?: string | null;
    address?: string | null;
    map_url?: string | null;
    work_hours?: string | null;
    phones: ContactPhone[];
};

export default function ContactPageView() {
    const { user } = useAuth();

    const [contact, setContact] = useState<ContactPage | null>(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = Boolean(user?.is_staff);

    useEffect(() => {
        async function loadContact() {
            try {
                const res = await http.get<ContactPage | null>(
                    "/about-us/contact/"
                );
                setContact(res);
            } catch (error: any) {
                if (error?.response?.status === 404) {
                    setContact(null);
                }
            } finally {
                setLoading(false);
            }
        }

        loadContact();
    }, []);

    if (loading) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-10">
                <p className="text-gray-500">Загрузка...</p>
            </main>
        );
    }

    if (!contact) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-10">
                {isAdmin && (
                    <Link
                        href="/contact/create"
                        className="inline-flex rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
                    >
                        Создать контакты
                    </Link>
                )}
            </main>
        );
    }

    const phones = [...contact.phones].sort(
        (a, b) => a.sort_order - b.sort_order
    );

    return (
        <main className="mx-auto max-w-5xl px-4 py-10">
            {isAdmin && (
                <div className="mb-6 flex justify-end">
                    <Link
                        href="/contact/edit"
                        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        Редактировать
                    </Link>
                </div>
            )}

            <section className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                    Контакты
                </h1>
                <p className="mt-4 text-lg text-gray-500">
                    Свяжитесь с нами удобным способом
                </p>
            </section>

            <section className="mt-10 grid gap-5 md:grid-cols-2">
                <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">
                        Информация
                    </h2>

                    <div className="space-y-4 text-gray-700">
                        {contact.address && (
                            <div>
                                <p className="text-sm text-gray-500">Адрес</p>
                                <p className="font-medium">{contact.address}</p>
                            </div>
                        )}

                        {contact.work_hours && (
                            <div>
                                <p className="text-sm text-gray-500">
                                    Время работы
                                </p>
                                <p className="font-medium">
                                    {contact.work_hours}
                                </p>
                            </div>
                        )}

                        {contact.instagram && (
                            <div>
                                <p className="text-sm text-gray-500">
                                    Instagram
                                </p>
                                <a
                                    href={contact.instagram}
                                    target="_blank"
                                    className="font-medium text-blue-600"
                                >
                                    {contact.instagram}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">
                        Номера телефонов
                    </h2>

                    <div className="space-y-3">
                        {phones.map((item, index) => (
                            <div
                                key={`${item.phone}-${index}`}
                                className="rounded-2xl bg-white p-4 shadow-sm"
                            >
                                {item.title && (
                                    <p className="text-sm text-gray-500">
                                        {item.title}
                                    </p>
                                )}

                                <a
                                    href={
                                        item.is_whatsapp
                                            ? `https://wa.me/${item.phone.replace(/\D/g, "")}`
                                            : `tel:${item.phone}`
                                    }
                                    className="mt-1 block text-lg font-semibold text-gray-900"
                                >
                                    {item.phone}
                                </a>

                                {item.is_whatsapp && (
                                    <p className="mt-1 text-sm text-green-600">
                                        WhatsApp
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {contact.map_url && (
                <section className="mt-8 overflow-hidden rounded-3xl bg-gray-50 shadow-sm">
                    <iframe
                        src={contact.map_url}
                        className="h-80 w-full border-0"
                        loading="lazy"
                    />
                </section>
            )}
        </main>
    );
}