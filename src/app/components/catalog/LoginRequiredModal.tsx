"use client";

import Link from "next/link";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function LoginRequiredModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">
          Нужно войти
        </h2>

        <p className="mt-3 text-sm text-gray-600">
          Чтобы добавить товар в избранное, необходимо авторизоваться.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Отмена
          </button>

          <Link
            href="/login"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
          >
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}