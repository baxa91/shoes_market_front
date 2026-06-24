"use client";

import { ChangeEvent, useRef, useState } from "react";
import { http } from "@/lib/http";

type AboutImage = {
    id: string;
    image: string;
    sort_order: number;
};

type Props = {
    images: AboutImage[];
    onRefresh: () => Promise<void>;
};

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default function AboutUsImages({ images, onRefresh }: Props) {
    const [extraImages, setExtraImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const uploadImages = async () => {
        if (extraImages.length === 0) return;

        setLoading(true);

        try {
            for (let index = 0; index < extraImages.length; index++) {
                await http.post("/about-us/image/", {
                    image: await fileToBase64(extraImages[index]),
                    sort_order: images.length + index,
                });
            }

            setExtraImages([]);

            if (inputRef.current) {
                inputRef.current.value = "";
            }

            await onRefresh();
        } finally {
            setLoading(false);
        }
    };

    const deleteImage = async (id: string) => {
        await http.delete(`/about-us/image/${id}/`);
        await onRefresh();
    };

    const sortedImages = [...images].sort(
        (a, b) => a.sort_order - b.sort_order
    );

    return (
        <div className="mt-10 rounded-2xl border border-gray-200 p-5">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Фотографии
            </h2>

            {sortedImages.length > 0 && (
                <div className="mb-6">
                    <p className="mb-3 text-sm font-medium text-gray-700">
                        Текущие фото
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {sortedImages.map((image) => (
                            <div
                                key={image.id}
                                className="relative overflow-hidden rounded-xl border border-gray-200"
                            >
                                <img
                                    src={image.image}
                                    alt="Фото о нас"
                                    className="h-32 w-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() => deleteImage(image.id)}
                                    className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Добавить фото
                </label>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setExtraImages(
                            e.target.files ? Array.from(e.target.files) : []
                        )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                />

                {extraImages.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {extraImages.map((file, index) => (
                            <div
                                key={`${file.name}-${index}`}
                                className="relative overflow-hidden rounded-xl border border-gray-200"
                            >
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Новое фото ${index + 1}`}
                                    className="h-32 w-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setExtraImages((prev) =>
                                            prev.filter((_, i) => i !== index)
                                        )
                                    }
                                    className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={uploadImages}
                disabled={loading || extraImages.length === 0}
                className="mt-5 w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Загружаем..." : "Добавить фото"}
            </button>
        </div>
    );
}