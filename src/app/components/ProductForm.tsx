"use client";

import { useEffect, useRef, useState } from "react";
import { http } from "@/lib/http";

type Tag = {
    id: string;
    name: string;
    type: string;
};

type ProductResponse = {
    id: string;
};

type ProductImage = {
    id: string;
    image?: string;
    url?: string;
};

type Product = {
    id: string;
    title: string;
    price: number;
    currency: string;
    description: string;
    article: string;
    main_image: string | null;
    tags: Tag[];
    images?: ProductImage[];
};

type ProductFormProps = {
    mode: "create" | "edit";
    productId?: string;
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

export default function ProductForm({ mode, productId }: ProductFormProps) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("KZT");
    const [description, setDescription] = useState("");

    const [mainImage, setMainImage] = useState<File | null>(null);
    const [existingMainImage, setExistingMainImage] = useState<string | null>(null);
    const [extraImages, setExtraImages] = useState<File[]>([]);

    const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
    const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const mainImageInputRef = useRef<HTMLInputElement | null>(null);
    const extraImagesInputRef = useRef<HTMLInputElement | null>(null);
    const [article, setArticle] = useState("");

    useEffect(() => {
        async function loadTags() {
            try {
                const data = await http.get<Tag[]>("/products/tags/");
                setTags(data);
            } catch {
                setTags([]);
            }
        }

        loadTags();
    }, []);

    useEffect(() => {
        if (mode !== "edit" || !productId) return;

        async function loadProduct() {
            try {
                const product = await http.get<Product>(`/products/${productId}/`);

                setTitle(product.title);
                setArticle(product.article);
                setPrice(String(product.price));
                setCurrency(product.currency);
                setDescription(product.description);
                setExistingMainImage(product.main_image);
                setSelectedTags(product.tags.map((tag) => tag.id));
                setExistingImages(product.images ?? []);
            } catch {
                setError("Не удалось загрузить товар");
            }
        }

        loadProduct();
    }, [mode, productId]);

    function toggleTag(tagId: string) {
        setSelectedTags((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        );
    }

    function removeExistingImage(imageId: string) {
        setRemovedImageIds((prev) => [...prev, imageId]);
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!title.trim()) {
            setError("Введите название товара");
            return;
        }
        if (!article.trim()) {
            setError("Введите артикул");
            return;
        }

        if (!price || Number(price) <= 0) {
            setError("Введите корректную цену");
            return;
        }

        if (!description.trim()) {
            setError("Введите описание товара");
            return;
        }

        if (mode === "create" && !mainImage) {
            setError("Выберите главное фото");
            return;
        }

        setLoading(true);

        try {
            let productIdToUse = productId;
            let mainImageBase64: string | undefined;

            if (mainImage) {
                mainImageBase64 = await fileToBase64(mainImage);
            }

            if (mode === "create") {
                const product = await http.post<ProductResponse>("/products/", {
                    article: article.trim(),
                    title: title.trim(),
                    price: Number(price),
                    tags: selectedTags,
                    currency,
                    description: description.trim(),
                    main_image: mainImageBase64,
                });

                productIdToUse = product.id;
            } else {
                await http.patch(`/products/${productId}/`, {
                    article: article.trim(),
                    title: title.trim(),
                    price: Number(price),
                    tags: selectedTags,
                    currency,
                    description: description.trim(),
                    ...(mainImageBase64 && {
                        main_image: mainImageBase64,
                    }),
                });
            }

            for (const imageId of removedImageIds) {
                await http.delete(`/products/image/${imageId}/`);
            }

            for (const image of extraImages) {
                await http.post("/products/image/", {
                    product_id: productIdToUse,
                    image: await fileToBase64(image),
                });
            }

            setSuccess(
                mode === "create"
                    ? "Товар успешно создан"
                    : "Товар успешно обновлён"
            );

            if (mode === "create") {
                setTitle("");
                setArticle("");
                setPrice("");
                setCurrency("KZT");
                setDescription("");
                setSelectedTags([]);
                setMainImage(null);
                setExtraImages([]);
                if (mainImageInputRef.current) {
                    mainImageInputRef.current.value = "";
                }

                if (extraImagesInputRef.current) {
                    extraImagesInputRef.current.value = "";
                }
            }

            setRemovedImageIds([]);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Ошибка при сохранении товара"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-full items-center justify-center px-4 py-10">
            <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {mode === "create" ? "Создать товар" : "Редактировать товар"}
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Заполните данные товара и добавьте фотографии
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Название
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Например: Nike Air Max"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Артикул
                        </label>

                        <input
                            value={article}
                            onChange={(e) => setArticle(e.target.value)}
                            placeholder="Например: NK-12345"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Цена
                            </label>
                            <input
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                type="number"
                                placeholder="25000"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Валюта
                            </label>
                            <input
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                placeholder="KZT"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Описание
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Описание товара"
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                        />
                    </div>

                    <div className="w-full">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Тэги
                        </label>

                        <div className="space-y-4">
                            {Object.entries(
                                tags.reduce<Record<string, Tag[]>>((acc, tag) => {
                                    const type = tag.type || "Другое";

                                    if (!acc[type]) {
                                        acc[type] = [];
                                    }

                                    acc[type].push(tag);

                                    return acc;
                                }, {})
                            ).map(([type, typeTags]) => (
                                <details
                                    key={type}
                                    className="rounded-lg border border-gray-300"
                                >
                                    <summary className="cursor-pointer list-none px-4 py-2 select-none font-medium text-gray-800">
                                        {type}{" "}
                                        <span className="text-sm font-normal text-gray-500">
                                            (
                                            {
                                                typeTags.filter((tag) =>
                                                    selectedTags.includes(tag.id)
                                                ).length
                                            }{" "}
                                            выбрано)
                                        </span>
                                    </summary>

                                    <div className="max-h-56 overflow-y-auto border-t border-gray-200 p-2">
                                        {typeTags.map((tag) => (
                                            <label
                                                key={tag.id}
                                                className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 hover:bg-gray-100"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTags.includes(tag.id)}
                                                    onChange={() => toggleTag(tag.id)}
                                                />
                                                <span>{tag.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </details>
                            ))}
                        </div>

                        {selectedTags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {tags
                                    .filter((tag) => selectedTags.includes(tag.id))
                                    .map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="rounded-full bg-gray-800 px-3 py-1 text-xs text-white"
                                        >
                                            {tag.type}: {tag.name}
                                        </span>
                                    ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            {mode === "create"
                                ? "Главное фото"
                                : "Новое главное фото"}
                        </label>
                        <input
                            ref={mainImageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setMainImage(e.target.files?.[0] ?? null)
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                        />
                        {(mainImage || existingMainImage) && (
                            <div className="mt-3 w-40 overflow-hidden rounded-xl border border-gray-200">
                                <img
                                    src={mainImage ? URL.createObjectURL(mainImage) : existingMainImage!}
                                    alt="Главное фото"
                                    className="h-40 w-full object-cover"
                                />

                                {mainImage && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMainImage(null);

                                            if (mainImageInputRef.current) {
                                                mainImageInputRef.current.value = "";
                                            }
                                        }}
                                        className="w-full bg-red-600 py-1 text-xs text-white"
                                    >
                                        Удалить новое фото
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {mode === "edit" && existingImages.length > 0 && (
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Текущие дополнительные фото
                            </label>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {existingImages.map((image) => {
                                    const imageUrl = image.image || image.url;

                                    return (
                                        <div
                                            key={image.id}
                                            className="relative overflow-hidden rounded-xl border border-gray-200"
                                        >
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt="Фото товара"
                                                    className="h-32 w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-32 items-center justify-center text-xs text-gray-400">
                                                    Нет фото
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(image.id)}
                                                className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Дополнительные фото
                        </label>
                        <input
                            ref={extraImagesInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) =>
                                setExtraImages(
                                    e.target.files
                                        ? Array.from(e.target.files)
                                        : []
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
                                            alt={`Фото ${index + 1}`}
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
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Сохраняем..."
                            : mode === "create"
                              ? "Создать товар"
                              : "Сохранить изменения"}
                    </button>
                </form>
            </div>
        </div>
    );
}