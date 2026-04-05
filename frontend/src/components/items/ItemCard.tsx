import { Link } from "react-router-dom";
import { useState } from "react";
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
  const [imgIndex, setImgIndex] = useState(0);
  const hasImages = item.images.length > 0;

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
        {/* Image area */}
        <div
          style={{
            height: 200,
            position: "relative",
            background: "linear-gradient(135deg, #FFF7F0 0%, #FFE8D6 100%)",
            overflow: "hidden",
          }}
        >
          {hasImages ? (
            <>
              <img
                src={item.images[imgIndex]}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "opacity 0.2s",
                }}
              />
              {/* Dot indicators */}
              {item.images.length > 1 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  {item.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.preventDefault();
                        setImgIndex(i);
                      }}
                      style={{
                        width: i === imgIndex ? 16 : 6,
                        height: 6,
                        borderRadius: "999px",
                        background:
                          i === imgIndex ? "#fff" : "rgba(255,255,255,0.55)",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        transition: "all 0.2s",
                      }}
                    />
                  ))}
                </div>
              )}
              {/* Prev / Next arrows (shown on image hover) */}
              {item.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setImgIndex(
                        (i) =>
                          (i - 1 + item.images.length) % item.images.length,
                      );
                    }}
                    style={{
                      position: "absolute",
                      left: 6,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.45)",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ‹
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setImgIndex((i) => (i + 1) % item.images.length);
                    }}
                    style={{
                      position: "absolute",
                      right: 6,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.45)",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ›
                  </button>
                </>
              )}
            </>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 52,
              }}
            >
              {CATEGORY_EMOJI[item.category] ?? "📦"}
            </div>
          )}

          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <Badge bg="rgba(255,255,255,0.92)" color="var(--text-secondary)">
              📍 {item.location.split(",")[0]}
            </Badge>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "14px 16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "8px",
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
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontSize: "16px",
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
                size={22}
              />
              <span
                style={{ fontSize: "12px", color: "var(--text-secondary)" }}
              >
                {item.owner.name}
              </span>
              {item.owner.verificationStatus === "VERIFIED" && (
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--green)",
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
              )}
            </div>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              ⭐{" "}
              {item.owner.averageRating > 0
                ? item.owner.averageRating.toFixed(1)
                : "New"}
            </span>
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
