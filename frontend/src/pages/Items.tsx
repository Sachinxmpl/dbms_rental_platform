import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { itemsApi } from "../api/client";
import type { Item } from "../types";
import { ItemCard } from "../components/items/ItemCard";
import { ItemFilters } from "../components/items/ItemFilters";
import { Spinner } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";

export default function Items() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string | number>>({});

  const load = useCallback(
    async (f: Record<string, string | number>, p: number) => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = {
          ...f,
          page: p,
          limit: 12,
        };
        if (searchParams.get("category"))
          params.category = searchParams.get("category")!;
        const res = await itemsApi.list(params);
        setItems(res.items);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      } finally {
        setLoading(false);
      }
    },
    [searchParams],
  );

  useEffect(() => {
    setPage(1);
    load(filters, 1);
  }, [filters, searchParams, load]);
  useEffect(() => {
    load(filters, page);
  }, [page , filters , load]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "36px",
            fontWeight: 900,
          }}
        >
          Browse Items
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>
          {total} items available for rent
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* Filters sidebar */}
        <div style={{ position: "sticky", top: "84px" }}>
          <ItemFilters
            onFilter={(f) => setFilters(f as Record<string, string | number>)}
          />
        </div>

        {/* Grid */}
        <div>
          {loading ? (
            <Spinner />
          ) : items.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                color: "var(--text-secondary)",
              }}
            >
              <div style={{ fontSize: "56px", marginBottom: "16px" }}>🔍</div>
              <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>
                No items found
              </h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "20px",
                }}
              >
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "40px",
                  }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ← Prev
                  </Button>
                  <span
                    style={{ fontSize: "14px", color: "var(--text-secondary)" }}
                  >
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next →
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
