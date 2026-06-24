"use client";

import { useEffect, useMemo, useState } from "react";
import { http } from "@/lib/http";
import { PaginatedResponse, Product, Tag } from "@/types/catalog";
import ProductCard from "./ProductCard";
import CatalogFilters from "./CatalogFilters";
import Pagination from "./Pagination";
import LoginRequiredModal from "./LoginRequiredModal";
import { useAuth } from "@/context/AuthContext";
import {
  loadCatalogFilters,
  saveCatalogFilters,
} from "@/lib/catalog-storage";
import { SelectedTag } from "@/types/catalog";

type Props = {
  favorites?: boolean;
};


export default function Catalog({ favorites = false }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([]);
  const [priceAfter, setPriceAfter] = useState("");
  const [priceBefore, setPriceBefore] = useState("");
  const [creasing, setCreasing] = useState<string>("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(4);
  const [pages, setPages] = useState(1);
  const [count, setCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const saved = loadCatalogFilters();

    if (saved) {
      setPage(saved.page ?? 1);
      setSelectedTags(saved.selectedTags ?? []);
      setPriceAfter(saved.priceAfter ?? "");
      setPriceBefore(saved.priceBefore ?? "");
      setCreasing(saved.creasing ?? "");
    }

    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;

    saveCatalogFilters({
      page,
      selectedTags,
      priceAfter,
      priceBefore,
      creasing,
    });
  }, [initialized, page, selectedTags, priceAfter, priceBefore, creasing]);

  const isAuth = () => {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem("access_token"));
  };

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("page_size", String(pageSize));

    if (priceAfter) {
      params.set("price_after", priceAfter);
    }

    if (priceBefore) {
      params.set("price_before", priceBefore);
    }

    if (creasing !== "") {
      params.set("creasing", creasing);
    }

    if (favorites) {
      params.set("favorites", "true");
    }

    selectedTags.forEach((tag) => {
      params.append("tags", `${tag.id}:${tag.type}`);
    });

    return params.toString();
  }, [page, pageSize, priceAfter, priceBefore, creasing, favorites, selectedTags]);

  const loadTags = async () => {
    const res = await http.get<Tag[]>("/products/tags/");
    setTags(res);
  };

  const loadProducts = async () => {
    setLoading(true);

    try {
      const res = await http.get<PaginatedResponse<Product>>(
        `/products/?${queryString}`
      );

      setProducts(res.results);
      setPages(res.pages);
      setCount(res.count);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    void loadProducts();
  }, [queryString, initialized]);

  const resetPage = () => {
    setPage(1);
  };

  const handleLike = async (product: Product) => {
    if (!isAuth()) {
      setShowLoginModal(true);
      return;
    }

    const oldProducts = products;

    setProducts((prev) =>
      prev.map((item) => {
        if (item.id !== product.id) return item;

        return {
          ...item,
          is_favorite: !item.is_favorite,
        };
      })
    );

    try {
      await http.get(`/products/like/${product.id}/`);

      if (favorites) {
        await loadProducts();
      }
    } catch {
      setProducts(oldProducts);
    }
  };
  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await http.delete(`/products/${productToDelete.id}/`);

      setProducts((prev) =>
        prev.filter((p) => p.id !== productToDelete.id)
      );
    } finally {
      setProductToDelete(null);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-3">
      <h1 className="mt-8 text-2xl font-bold text-gray-900">
        {favorites ? "Избранные товары" : "Каталог товаров"}
      </h1>
      <div className="mt-6 w-full max-w-6xl rounded-2xl bg-green-50 border border-green-200 p-4">
        <div className="flex items-center justify-center gap-2 text-center">
          <span className="text-2xl">🚚</span>

          <div>
            <h2 className="font-semibold text-green-800">
              Доставка по Бурундаю бесплатно
            </h2>

            <p className="text-sm text-green-700">
              Быстрая доставка и примерка перед покупкой
            </p>
          </div>
        </div>
      </div>
      <CatalogFilters
        tags={tags}
        selectedTags={selectedTags}
        onSelectedTagsChange={(ids) => {
          setSelectedTags(ids);
          resetPage();
        }}
        priceAfter={priceAfter}
        priceBefore={priceBefore}
        onPriceAfterChange={(value) => {
          setPriceAfter(value);
          resetPage();
        }}
        onPriceBeforeChange={(value) => {
          setPriceBefore(value);
          resetPage();
        }}
        creasing={creasing}
        onCreasingChange={(value) => {
          setCreasing(value);
          resetPage();
        }}
      />

      <div className="mt-4 text-sm text-gray-500">
        Найдено товаров: {count}
      </div>

      {loading ? (
        <div className="mt-10 text-gray-500">Загрузка...</div>
      ) : (
        <div className="flex justify-center flex-wrap mt-6 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAdmin={Boolean(user?.is_staff)}
                onLike={() => handleLike(product)}
                onDelete={() => setProductToDelete(product)}
              />
            ))
          ) : (
            <div className="mt-10 text-gray-500">
              Товары не найдены
            </div>
          )}
        </div>
      )}

      <Pagination page={page} pages={pages} onChange={setPage} />

      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">
              Удалить товар?
            </h2>

            <p className="mt-3 text-gray-600">
              Вы действительно хотите удалить товар
              <span className="font-semibold">
                {" "}
                «{productToDelete.title}»
              </span>
              ?
            </p>

            <p className="mt-2 text-sm text-red-500">
              Это действие нельзя отменить.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                Отмена
              </button>

              <button
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