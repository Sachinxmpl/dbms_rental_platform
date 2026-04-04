import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "MUSICAL_INSTRUMENTS", label: "Instruments" },
  { value: "VEHICLES", label: "Vehicles" },
  { value: "SPORTS_EQUIPMENT", label: "Sports" },
  { value: "TOOLS", label: "Tools" },
  { value: "CLOTHING", label: "Clothing" },
  { value: "OTHER", label: "Other" },
];

interface Filters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function ItemFilters({ onFilter }: { onFilter: (f: Filters) => void }) {
  const [filters, setFilters] = useState<Filters>({});

  const set = (key: keyof Filters, value: string | number) =>
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));

  const apply = () => onFilter(filters);
  const reset = () => {
    setFilters({});
    onFilter({});
  };

  return (
    <div
      style={{
        background: "var(--white)",
        borderRadius: "var(--radius-card)",
        padding: "20px",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Filters</h3>

      {/* Category pills */}
      <div>
        <label
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--text-secondary)",
            marginBottom: "8px",
            display: "block",
          }}
        >
          CATEGORY
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => set("category", cat.value)}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-pill)",
                fontSize: "13px",
                fontWeight: 500,
                border: "1.5px solid",
                borderColor:
                  filters.category === cat.value ||
                  (!filters.category && cat.value === "")
                    ? "var(--orange)"
                    : "var(--border)",
                background:
                  filters.category === cat.value ||
                  (!filters.category && cat.value === "")
                    ? "#FFF0E8"
                    : "var(--white)",
                color:
                  filters.category === cat.value ||
                  (!filters.category && cat.value === "")
                    ? "var(--orange)"
                    : "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Location"
        placeholder="e.g. Thamel"
        value={filters.location ?? ""}
        onChange={(e) => set("location", e.target.value)}
      />

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
      >
        <Input
          label="Min Price/day (रू)"
          type="number"
          value={filters.minPrice ?? ""}
          onChange={(e) => set("minPrice", Number(e.target.value))}
        />
        <Input
          label="Max Price/day (रू)"
          type="number"
          value={filters.maxPrice ?? ""}
          onChange={(e) => set("maxPrice", Number(e.target.value))}
        />
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <Button fullWidth onClick={apply}>
          Apply
        </Button>
        <Button variant="ghost" fullWidth onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
