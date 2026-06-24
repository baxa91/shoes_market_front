import { SelectedTag } from "@/types/catalog";

const STORAGE_KEY = "catalog_filters";

export type CatalogFiltersStorage = {
  page: number;
  selectedTags: SelectedTag[];
  priceAfter: string;
  priceBefore: string;
  creasing: string;
};

export function saveCatalogFilters(filters: CatalogFiltersStorage) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
}

export function loadCatalogFilters(): CatalogFiltersStorage | null {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as CatalogFiltersStorage;
  } catch {
    return null;
  }
}