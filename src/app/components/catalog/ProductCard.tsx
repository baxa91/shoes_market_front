"use client";

import Link from "next/link";
import { Product } from "@/types/catalog";

type Props = {
  product: Product;
  isAdmin?: boolean;
  onLike: () => void;
  onDelete?: () => void;
};

export default function ProductCard({
  product,
  isAdmin = false,
  onLike,
  onDelete,
}: Props) {
  const liked = product.is_favorite;

  const productUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/product/${product.id}`
      : `/product/${product.id}`;

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";

  const whatsappText = encodeURIComponent(
    `Здравствуйте!\n\nМеня заинтересовал товар «${product.title}».\nЕсть ли сейчас размеры в наличии?\n\nСсылка:\n${productUrl}`
  );

  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappText}`;

  return (
    <div className="relative w-64 rounded-2xl border bg-white p-3 shadow-sm transition hover:shadow-md">
      <button
        type="button"
        onClick={onLike}
        className="absolute right-3 top-3 z-10 p-1 transition-transform hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={2}
          className={`h-7 w-7 transition-colors ${
            liked
              ? "text-red-500"
              : "text-white drop-shadow-md hover:text-red-400"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21s-7-4.35-9.5-8.28C.72 9.9 2.2 5.75 6.1 4.63c2.13-.61 4.2.18 5.9 2.01 1.7-1.83 3.77-2.62 5.9-2.01 3.9 1.12 5.38 5.27 3.6 8.09C19 16.65 12 21 12 21z"
          />
        </svg>
      </button>
      {isAdmin && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute left-3 top-3 z-10 p-1 transition-transform hover:scale-110"
          title="Удалить товар"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className="h-7 w-7 text-white drop-shadow-md hover:text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0-.7 12.1A2 2 0 0114.3 21H9.7a2 2 0 01-2-1.9L7 7m4 4v6m2-6v6"
            />
          </svg>
        </button>
      )}

      <Link href={`/product/${product.id}`}>
        <div className="h-48 w-full overflow-hidden rounded-xl bg-gray-100">
          {product.main_image ? (
            <img
              src={product.main_image}
              alt={product.title}
              className="h-full w-full object-cover transition hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Нет фото
            </div>
          )}
        </div>
      </Link>

      <div className="mt-3">
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-1 font-bold text-gray-900 hover:underline">
            {product.title}
          </h3>
        </Link>

        <p className="mt-1 text-xs text-gray-500">
          Артикул: {product.article}
        </p>

        <p className="mt-3 text-lg font-bold text-gray-900">
          {product.price.toLocaleString("ru-RU")} {product.currency}
        </p>

        <div className="mt-4 flex gap-2">
          <Link
            href={`/product/${product.id}`}
            className="flex-1 rounded-lg border px-3 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            Подробнее
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-green-700"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}