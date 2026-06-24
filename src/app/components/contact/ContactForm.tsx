"use client";

import { FormEvent, useState } from "react";

type ContactPhone = {
    phone: string;
    title: string;
    is_whatsapp: boolean;
    sort_order: number;
};

export type ContactFormValues = {
    instagram: string;
    address: string;
    map_url: string;
    work_hours: string;
    phones: ContactPhone[];
};

type Props = {
    initialValues?: Partial<ContactFormValues>;
    submitText: string;
    onSubmit: (values: ContactFormValues) => Promise<void>;
};

export default function ContactForm({
    initialValues,
    submitText,
    onSubmit,
}: Props) {
    const [instagram, setInstagram] = useState(initialValues?.instagram ?? "");
    const [address, setAddress] = useState(initialValues?.address ?? "");
    const [mapUrl, setMapUrl] = useState(initialValues?.map_url ?? "");
    const [workHours, setWorkHours] = useState(initialValues?.work_hours ?? "");

    const [phones, setPhones] = useState<ContactPhone[]>(
        initialValues?.phones?.length
            ? initialValues.phones
            : [
                  {
                      phone: "",
                      title: "",
                      is_whatsapp: false,
                      sort_order: 0,
                  },
              ]
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const updatePhone = (
        index: number,
        field: keyof ContactPhone,
        value: string | boolean | number
    ) => {
        setPhones((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const addPhone = () => {
        setPhones((prev) => [
            ...prev,
            {
                phone: "",
                title: "",
                is_whatsapp: false,
                sort_order: prev.length,
            },
        ]);
    };

    const removePhone = (index: number) => {
        setPhones((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        const cleanedPhones = phones
            .filter((item) => item.phone.trim())
            .map((item, index) => ({
                phone: item.phone.trim(),
                title: item.title.trim(),
                is_whatsapp: item.is_whatsapp,
                sort_order: index,
            }));

        try {
            setLoading(true);

            await onSubmit({
                instagram: instagram.trim(),
                address: address.trim(),
                map_url: mapUrl.trim(),
                work_hours: workHours.trim(),
                phones: cleanedPhones,
            });
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    "Не удалось сохранить контакты"
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
                    Instagram
                </label>
                <input
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Адрес
                </label>
                <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Бурундай, ..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Время работы
                </label>
                <input
                    value={workHours}
                    onChange={(e) => setWorkHours(e.target.value)}
                    placeholder="Пн-Вс 10:00-20:00"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Ссылка на карту
                </label>
                <textarea
                    value={mapUrl}
                    onChange={(e) => setMapUrl(e.target.value)}
                    rows={3}
                    placeholder="iframe src или ссылка на карту"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                />
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Номера телефонов
                    </h2>

                    <button
                        type="button"
                        onClick={addPhone}
                        className="rounded-lg bg-gray-800 px-3 py-2 text-sm text-white"
                    >
                        Добавить номер
                    </button>
                </div>

                <div className="space-y-4">
                    {phones.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-xl bg-gray-50 p-4"
                        >
                            <div className="grid gap-3 sm:grid-cols-2">
                                <input
                                    value={item.title}
                                    onChange={(e) =>
                                        updatePhone(
                                            index,
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Название: Основной, WhatsApp..."
                                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                />

                                <input
                                    value={item.phone}
                                    onChange={(e) =>
                                        updatePhone(
                                            index,
                                            "phone",
                                            e.target.value
                                        )
                                    }
                                    placeholder="+7 700 123 45 67"
                                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                />
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={item.is_whatsapp}
                                        onChange={(e) =>
                                            updatePhone(
                                                index,
                                                "is_whatsapp",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    WhatsApp
                                </label>

                                {phones.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removePhone(index)}
                                        className="text-sm text-red-600"
                                    >
                                        Удалить
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
                {loading ? "Сохранение..." : submitText}
            </button>
        </form>
    );
}