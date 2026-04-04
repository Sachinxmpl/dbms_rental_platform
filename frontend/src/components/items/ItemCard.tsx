import { Link } from "react-router-dom";
import type { Item } from "../../types";
import { Badge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";

const CATEGORY_EMOJI: Record<string, string> = {
  ELECTRONICS: "💻",
  MUSICAL_INSTRUMENTS: "🎸",
  VEHICLES: "🚗",
  SPORTS_EQUIPMENT: "⚽",
  TOOLS: "🔧",
  CLOTHING: "👕",
  OTHER: "📦",
};

export function ItemCard({ item }: { item: Item }) {
  return (
    <Link to={`/items/${item.id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "var(--white)",
          borderRadius: "var(--radius-card)",
          border: "1px solid var(--border)",
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "var(--shadow-md)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        }}
      >
        {/* Image */}
        <div
          style={{
            height: 200,
            background: "linear-gradient(135deg, #FFF7F0 0%, #FFE8D6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 56,
            position: "relative",
          }}
        >
          {item.images[0] ? (
            <img
              src={item.images[0]}
              alt={item.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            (CATEGORY_EMOJI[item.category] ?? "📦")
          )}
          <div style={{ position: "absolute", top: 12, right: 12 }}>
            <Badge bg="var(--white)" color="var(--text-secondary)">
              {item.location}
            </Badge>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "8px",
            }}
          >
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--text-primary)",
                lineHeight: 1.3,
                flex: 1,
              }}
            >
              {item.title}
            </h3>
            <div style={{ textAlign: "right", marginLeft: "8px" }}>
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "var(--orange)",
                }}
              >
                रू{item.pricePerDay}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                /day
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Avatar
                name={item.owner.name}
                url={item.owner.avatarUrl}
                size={24}
              />
              <span
                style={{ fontSize: "12px", color: "var(--text-secondary)" }}
              >
                {item.owner.name}
              </span>
              {item.owner.verificationStatus === "VERIFIED" && (
                <span title="Verified" style={{ fontSize: "12px" }}>
                  ✓
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              ⭐{" "}
              {item.owner.averageRating > 0
                ? item.owner.averageRating.toFixed(1)
                : "New"}
            </div>
          </div>

          <div style={{ marginTop: "8px" }}>
            <span
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                background: "var(--bg)",
                padding: "3px 10px",
                borderRadius: "var(--radius-pill)",
              }}
            >
              Deposit: रू{item.depositAmount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
