import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { rentalsApi } from "../api/client";
import type { Rental } from "../types";
import { RentalStatusBadge } from "../components/rentals/RentalStatusBadge";
import { Spinner } from "../components/ui/Spinner";
import { format } from "date-fns";

type RoleTab = "renter" | "owner";

export default function MyRentals() {
  const [tab, setTab] = useState<RoleTab>("renter");
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const data = await rentalsApi.getMyRentals(tab);
        setRentals(data);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [tab]);

  const TabBtn = ({ t, label }: { t: RoleTab; label: string }) => (
    <button
      onClick={() => setTab(t)}
      style={{
        padding: "10px 28px",
        borderRadius: "var(--radius-pill)",
        fontWeight: 600,
        fontSize: "14px",
        background: tab === t ? "var(--orange)" : "var(--white)",
        color: tab === t ? "#fff" : "var(--text-secondary)",
        border: `1.5px solid ${tab === t ? "var(--orange)" : "var(--border)"}`,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "36px",
          fontWeight: 900,
          marginBottom: "24px",
        }}
      >
        My Rentals
      </h1>

      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
        <TabBtn t="renter" label="I'm Renting" />
        <TabBtn t="owner" label="My Listings' Rentals" />
      </div>

      {loading ? (
        <Spinner />
      ) : rentals.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            color: "var(--text-secondary)",
          }}
        >
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>📋</div>
          <p>No rentals yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {rentals.map((rental) => (
            <Link
              key={rental.id}
              to={`/rentals/${rental.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "var(--white)",
                  borderRadius: "var(--radius-card)",
                  border: "1px solid var(--border)",
                  padding: "20px 24px",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  gap: "16px",
                  boxShadow: "var(--shadow-sm)",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: "16px",
                      marginBottom: "6px",
                    }}
                  >
                    {rental.item.title}
                  </h3>
                  <div
                    style={{ fontSize: "13px", color: "var(--text-secondary)" }}
                  >
                    {format(new Date(rental.startDate), "MMM d")} →{" "}
                    {format(new Date(rental.endDate), "MMM d, yyyy")} ·{" "}
                    {rental.totalDays} days
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      marginTop: "4px",
                    }}
                  >
                    {tab === "renter"
                      ? `Owner: ${rental.owner.name}`
                      : `Renter: ${rental.renter.name}`}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "8px",
                  }}
                >
                  <RentalStatusBadge status={rental.status} />
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "var(--orange)",
                    }}
                  >
                    रू{rental.rentalAmount}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
