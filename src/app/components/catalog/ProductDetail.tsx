"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { http } from "@/lib/http";
import { DetailProduct } from "@/types/catalog";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Props = {
  productId: string;
};

export default function ProductDetail({ productId }: Props) {
  const [product, setProduct] = useState<DetailProduct | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = Boolean(user?.is_staff);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";

  const loadProduct = async () => {
    setLoading(true);

    try {
      const data = await http.get<DetailProduct>(`/products/${productId}/`);
      setProduct(data);
      setActiveImage(data.main_image || data.images?.[0]?.image || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [productId]);
  const handleDelete = async () => {
      if (!product) return;

      await http.delete(`/products/${product.id}/`);

      setShowDeleteModal(false);
      router.push("/");
    };
  const allImages = useMemo(() => {
    if (!product) return [];

    const images = [
      product.main_image,
      ...product.images.map((item) => item.image),
    ].filter(Boolean) as string[];

    return Array.from(new Set(images));
  }, [product]);

  const productUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/product/${productId}`
      : "";

  const whatsappText = product
    ? encodeURIComponent(
        `Здравствуйте!\n\nМеня заинтересовал товар «${product.title}».\nЕсть ли сейчас размеры в наличии?\n\nСсылка:\n${productUrl}`
      )
    : "";

  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappText}`;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
        Загрузка товара...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
        Товар не найден
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Фото */}
        <div>
          <div className="overflow-hidden rounded-2xl bg-gray-100">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.title}
                className="h-[360px] w-full object-cover sm:h-[520px]"
              />
            ) : (
              <div className="flex h-[360px] items-center justify-center text-gray-400">
                Нет фото
              </div>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {allImages.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border ${
                    activeImage === image
                      ? "border-gray-900"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Информация */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {product.title}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Артикул: {product.article}
          </p>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            {product.price.toLocaleString("ru-RU")} {product.currency}
          </p>

          {product.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6">
            <h2 className="font-bold text-gray-900">Описание</h2>
            <p className="mt-2 whitespace-pre-line text-gray-700">
              {product.description}
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex w-full items-center justify-center rounded-xl bg-green-600 px-5 py-4 text-base font-bold text-white hover:bg-green-700"
          >
            Написать в WhatsApp
          </a>
            {isAdmin && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Link
                  href={`/edit_product/${product.id}`}
                  className="flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50"
                >
                  Редактировать
                </Link>

                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
            )}
        </div>
      </div>
        {showDeleteModal && product && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900">
                Удалить товар?
              </h2>

              <p className="mt-3 text-gray-600">
                Вы действительно хотите удалить товар{" "}
                <span className="font-semibold">
                  «{product.title}»
                </span>
                ?
              </p>

              <p className="mt-2 text-sm text-red-500">
                Это действие нельзя отменить.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-lg border px-4 py-2 hover:bg-gray-50"
                >
                  Отмена
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}