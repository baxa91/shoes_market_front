"use client";

type Props = {
  page: number;
  pages: number;
  onChange: (page: number) => void;
};

export default function Pagination({ page, pages, onChange }: Props) {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-8 mb-8">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
      >
        Назад
      </button>

      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className={`h-10 w-10 rounded-lg text-sm ${
            num === page
              ? "bg-gray-900 text-white"
              : "border text-gray-900 hover:bg-gray-50"
          }`}
        >
          {num}
        </button>
      ))}

      <button
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
        className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
      >
        Вперед
      </button>
    </div>
  );
}