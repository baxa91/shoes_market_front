"use client";

import { Tag } from "@/types/catalog";

type SelectedTag = {
  id: string;
  type: string;
};

type Props = {
  tags: Tag[];
  selectedTags: SelectedTag[];
  onSelectedTagsChange: (tags: SelectedTag[]) => void;

  priceAfter: string;
  priceBefore: string;
  onPriceAfterChange: (value: string) => void;
  onPriceBeforeChange: (value: string) => void;

  creasing: string;
  onCreasingChange: (value: string) => void;
};

export default function CatalogFilters({
  tags,
  selectedTags,
  onSelectedTagsChange,
  priceAfter,
  priceBefore,
  onPriceAfterChange,
  onPriceBeforeChange,
  creasing,
  onCreasingChange,
}: Props) {
  const groupedTags = tags.reduce<Record<string, Tag[]>>((acc, tag) => {
    if (!acc[tag.type]) acc[tag.type] = [];
    acc[tag.type].push(tag);
    return acc;
  }, {});

  const toggleTag = (tag: Tag) => {
    const exists = selectedTags.some((item) => item.id === tag.id);

    if (exists) {
      onSelectedTagsChange(
        selectedTags.filter((item) => item.id !== tag.id)
      );
    } else {
      onSelectedTagsChange([
        ...selectedTags,
        {
          id: tag.id,
          type: tag.type,
        },
      ]);
    }
  };

  return (
    <div className="w-full max-w-6xl mt-6 rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(groupedTags).map(([type, items]) => (
            <div key={type} className="rounded-xl border p-3">
              <h3 className="font-bold text-gray-900 mb-3">
                {type}
              </h3>

              <div className="flex flex-col gap-2">
                {items.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags.some((item) => item.id === tag.id)}
                      onChange={() => toggleTag(tag)}
                    />
                    <span>{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={priceAfter}
              onChange={(e) => onPriceAfterChange(e.target.value)}
              placeholder="Цена от"
              className="w-32 rounded-lg border px-3 py-2 text-sm"
            />

            <input
              type="number"
              value={priceBefore}
              onChange={(e) => onPriceBeforeChange(e.target.value)}
              placeholder="Цена до"
              className="w-32 rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <select
            value={creasing}
            onChange={(e) => onCreasingChange(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Новые сначала</option>
            <option value="false">Сначала дешевые</option>
            <option value="true">Сначала дорогие</option>
          </select>
        </div>
      </div>
    </div>
  );
}