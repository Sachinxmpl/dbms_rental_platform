import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { itemsApi, rentalsApi } from "../api/client";
import type { Item } from "../types";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Spinner } from "../components/ui/Spinner";
import { Avatar } from "../components/ui/Avatar";
import { useAuth } from "../hooks/useAuth";
import { toast } from "../hooks/useToast";
import { format, differenceInCalendarDays } from "date-fns";
import axios from "axios";

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    itemsApi
      .getById(id!)
      .then(setItem)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!item)
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>Item not found</div>
    );

  const days =
    dates.startDate && dates.endDate
      ? Math.max(
          0,
          differenceInCalendarDays(
            new Date(dates.endDate),
            new Date(dates.startDate),
          ),
        )
      : 0;
  const rentalTotal = days * item.pricePerDay;

  const submitRental = async () => {
    if (!isLoggedIn) return navigate("/login");
    if (user?.verificationStatus !== "VERIFIED") {
      toast(
        "You must be ID-verified to rent. Go to Profile → Verify.",
        "error",
      );
      return;
    }
    setSubmitting(true);
    try {
      await rentalsApi.create({
        itemId: item.id,
        startDate: dates.startDate,
        endDate: dates.endDate,
      });
      toast("Rental request sent! Waiting for owner approval.", "success");
      setBookingOpen(false);
      navigate("/rentals");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast(
          err.response?.data?.message ?? "Failed to create rental",
          "error",
        );
      } else {
        toast("Something went wrong ");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isOwner = user?.id === item.ownerId;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "40px",
          alignItems: "start",
        }}
      >
        {/* Left */}
        <div>
          {/* Image */}
          <div
            style={{
              borderRadius: "var(--radius-card)",
              overflow: "hidden",
              marginBottom: "32px",
              height: 380,
              background: "linear-gradient(135deg, #FFF7F0, #FFE8D6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 80,
            }}
          >
            {item.images[0] ? (
              <img
                src={item.images[0]}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              "📦"
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            <Badge>{item.category.replace(/_/g, " ")}</Badge>
            <Badge bg="#F0FDF4" color="#15803D">
              📍 {item.location}
            </Badge>
            {item.status !== "AVAILABLE" && (
              <Badge bg="#FEE2E2" color="#DC2626">
                🔒 {item.status}
              </Badge>
            )}
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              fontWeight: 900,
              marginBottom: "12px",
            }}
          >
            {item.title}
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              fontSize: "16px",
              marginBottom: "32px",
            }}
          >
            {item.description}
          </p>

          {/* Trust info */}
          <div
            style={{
              background: "#FFFBF0",
              border: "1px solid #FDE68A",
              borderRadius: "var(--radius-card)",
              padding: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              🛡️ Trust & Safety
            </h3>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {[
                "Security deposit held until owner confirms return",
                "Photo condition report at pickup and return",
                "Both parties rated after each rental",
                "ID verification required for renters",
              ].map((t) => (
                <li
                  key={t}
                  style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "var(--green)" }}>✓</span> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right — Booking card */}
        <div style={{ position: "sticky", top: "84px" }}>
          <div
            style={{
              background: "var(--white)",
              borderRadius: "var(--radius-card)",
              boxShadow: "var(--shadow-lg)",
              padding: "28px",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "36px",
                  fontWeight: 900,
                  color: "var(--orange)",
                }}
              >
                रू{item.pricePerDay}
              </span>
              <span
                style={{ color: "var(--text-secondary)", fontSize: "14px" }}
              >
                {" "}
                /day
              </span>
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                marginBottom: "20px",
              }}
            >
              Deposit:{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                रू{item.depositAmount}
              </strong>{" "}
              (refunded after return)
            </div>

            {/* Owner info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px",
                background: "var(--bg)",
                borderRadius: "var(--radius-card)",
                marginBottom: "20px",
              }}
            >
              <Avatar
                name={item.owner.name}
                url={item.owner.avatarUrl}
                size={44}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px" }}>
                  {item.owner.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "center",
                    marginTop: "2px",
                  }}
                >
                  {item.owner.verificationStatus === "VERIFIED" && (
                    <Badge bg="#DCFCE7" color="#166534">
                      ✓ Verified
                    </Badge>
                  )}
                  {item.owner.averageRating > 0 && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      ⭐ {item.owner.averageRating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isOwner ? (
              <Button
                variant="ghost"
                fullWidth
                onClick={() => navigate(`/items/${item.id}/edit`)}
              >
                Edit Listing
              </Button>
            ) : item.status === "AVAILABLE" ? (
              <Button
                fullWidth
                size="lg"
                onClick={() =>
                  isLoggedIn ? setBookingOpen(true) : navigate("/login")
                }
              >
                Request to Rent
              </Button>
            ) : (
              <Button fullWidth disabled>
                Not Available
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title="Book this item"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Start Date
              </label>
              <input
                type="date"
                min={format(new Date(), "yyyy-MM-dd")}
                value={dates.startDate}
                onChange={(e) =>
                  setDates((d) => ({ ...d, startDate: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1.5px solid var(--border)",
                  borderRadius: "var(--radius-pill)",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                End Date
              </label>
              <input
                type="date"
                min={dates.startDate || format(new Date(), "yyyy-MM-dd")}
                value={dates.endDate}
                onChange={(e) =>
                  setDates((d) => ({ ...d, endDate: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1.5px solid var(--border)",
                  borderRadius: "var(--radius-pill)",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                }}
              />
            </div>
          </div>

          {days > 0 && (
            <div
              style={{
                background: "var(--bg)",
                borderRadius: "var(--radius-card)",
                padding: "16px",
              }}
            >
              {[
                [
                  `${days} day${days > 1 ? "s" : ""} × रू${item.pricePerDay}`,
                  `रू${rentalTotal}`,
                ],
                ["Refundable deposit", `रू${item.depositAmount}`],
              ].map(([label, val]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    padding: "4px 0",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    {label}
                  </span>
                  <span style={{ fontWeight: 600 }}>{val}</span>
                </div>
              ))}
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  marginTop: "10px",
                  paddingTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                  fontSize: "15px",
                }}
              >
                <span>Total upfront</span>
                <span style={{ color: "var(--orange)" }}>
                  रू{rentalTotal + item.depositAmount}
                </span>
              </div>
            </div>
          )}

          <Button
            fullWidth
            size="lg"
            loading={submitting}
            disabled={!days}
            onClick={submitRental}
          >
            Send Rental Request
          </Button>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              textAlign: "center",
            }}
          >
            No charge yet — the owner must approve first.
          </p>
        </div>
      </Modal>
    </div>
  );
}
