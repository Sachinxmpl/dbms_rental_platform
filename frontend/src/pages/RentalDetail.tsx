import { JSX, useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { rentalsApi, reviewsApi } from "../api/client";
import type { Rental } from "../types";
import { RentalStatusBadge } from "../components/rentals/RentalStatusBadge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Spinner } from "../components/ui/Spinner";
import { Card } from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";
import { toast } from "../hooks/useToast";
import { format } from "date-fns";
import axios from "axios";

export default function RentalDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: "" });

  const load = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await rentalsApi.getById(id);
      setRental(data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Spinner />;
  if (!rental)
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        Rental not found
      </div>
    );

  const isOwner = user?.id === rental.ownerId;
  const isRenter = user?.id === rental.renterId;

  const doAction = async (action: string, meta?: Record<string, unknown>) => {
    setActionLoading(true);
    try {
      await rentalsApi.updateStatus(rental.id, action, meta);
      toast("Status updated!", "success");
      load();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast(err.response?.data?.message ?? "Action failed", "error");
      } else {
        toast("Something went wrong ");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const submitReview = async () => {
    const revieweeId = isOwner ? rental.renterId : rental.ownerId;
    try {
      await reviewsApi.create(rental.id, { revieweeId, ...review });
      toast("Review submitted!", "success");
      setReviewOpen(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast(err.response?.data?.message ?? "Failed", "error");
      } else {
        toast("SOmething went wrong ");
      }
    }
  };

  // Owner actions per status
  const ownerActions: Partial<Record<string, JSX.Element>> = {
    PENDING: (
      <div style={{ display: "flex", gap: "12px" }}>
        <Button
          onClick={() => doAction("approve")}
          loading={actionLoading}
          variant="secondary"
        >
          ✅ Approve
        </Button>
        <Button
          variant="danger"
          onClick={() => doAction("reject")}
          loading={actionLoading}
        >
          ❌ Reject
        </Button>
      </div>
    ),
    RETURN_REQUESTED: (
      <div style={{ display: "flex", gap: "12px" }}>
        <Button
          onClick={() => doAction("confirm_return")}
          loading={actionLoading}
        >
          ✅ Confirm Return & Release Deposit
        </Button>
        <Button
          variant="danger"
          onClick={() => doAction("dispute")}
          loading={actionLoading}
        >
          ⚠️ Dispute
        </Button>
      </div>
    ),
  };

  const renterActions: Partial<Record<string, JSX.Element>> = {
    APPROVED: (
      <Button onClick={() => doAction("pay_deposit")} loading={actionLoading}>
        💳 Pay Deposit & Confirm
      </Button>
    ),
    ACTIVE: (
      <Button
        variant="secondary"
        onClick={() => doAction("request_return")}
        loading={actionLoading}
      >
        ↩️ Mark as Returned
      </Button>
    ),
  };

  const canCancel =
    (isOwner || isRenter) && ["PENDING", "APPROVED"].includes(rental.status);

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid var(--border)",
        fontSize: "14px",
      }}
    >
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>
      <button
        onClick={() => navigate("/rentals")}
        style={{
          color: "var(--text-secondary)",
          fontSize: "14px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
        }}
      >
        ← Back to rentals
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "30px",
              fontWeight: 900,
              marginBottom: "8px",
            }}
          >
            {rental.item.title}
          </h1>
          <RentalStatusBadge status={rental.status} />
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "var(--orange)",
              fontFamily: "var(--font-display)",
            }}
          >
            रू{rental.rentalAmount}
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            + रू{rental.depositAmount} deposit
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        <Card>
          <h3 style={{ fontWeight: 700, marginBottom: "16px" }}>Rental Info</h3>
          <InfoRow
            label="Start date"
            value={format(new Date(rental.startDate), "MMM d, yyyy")}
          />
          <InfoRow
            label="End date"
            value={format(new Date(rental.endDate), "MMM d, yyyy")}
          />
          <InfoRow label="Duration" value={`${rental.totalDays} days`} />
          <InfoRow
            label="Deposit paid"
            value={rental.depositPaid ? "✅ Yes" : "⏳ No"}
          />
          <InfoRow
            label="Deposit released"
            value={rental.depositReleased ? "✅ Yes" : "🔒 Held"}
          />
        </Card>

        <Card>
          <h3 style={{ fontWeight: 700, marginBottom: "16px" }}>Parties</h3>
          <InfoRow label="Owner" value={rental.owner.name} />
          <InfoRow label="Renter" value={rental.renter.name} />
          {rental.ownerNote && (
            <InfoRow label="Owner note" value={rental.ownerNote} />
          )}
          {rental.cancellationReason && (
            <InfoRow
              label="Cancellation reason"
              value={rental.cancellationReason}
            />
          )}
        </Card>
      </div>

      {/* Condition reports */}
      {rental.pickupConditionNote && (
        <Card style={{ marginBottom: "24px" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "8px" }}>
            📸 Pickup Condition
          </h3>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            {rental.pickupConditionNote}
          </p>
        </Card>
      )}
      {rental.returnConditionNote && (
        <Card style={{ marginBottom: "24px" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "8px" }}>
            📸 Return Condition
          </h3>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            {rental.returnConditionNote}
          </p>
        </Card>
      )}

      {/* Actions */}
      <Card style={{ marginBottom: "24px" }}>
        <h3 style={{ fontWeight: 700, marginBottom: "16px" }}>Actions</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {isOwner && ownerActions[rental.status]}
          {isRenter && renterActions[rental.status]}
          {canCancel && (
            <Button
              variant="ghost"
              onClick={() => doAction("cancel")}
              loading={actionLoading}
            >
              Cancel Rental
            </Button>
          )}
          {rental.status === "COMPLETED" && (
            <Button variant="secondary" onClick={() => setReviewOpen(true)}>
              ⭐ Leave a Review
            </Button>
          )}
          {!isOwner && !isRenter && (
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              No actions available.
            </p>
          )}
          {(isOwner || isRenter) &&
            !ownerActions[rental.status] &&
            !renterActions[rental.status] &&
            !canCancel &&
            rental.status !== "COMPLETED" && (
              <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                No actions needed right now.
              </p>
            )}
        </div>
      </Card>

      {/* Review Modal */}
      <Modal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title="Leave a Review"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label
              style={{
                fontSize: "13px",
                fontWeight: 600,
                display: "block",
                marginBottom: "10px",
              }}
            >
              Rating
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => setReview((v) => ({ ...v, rating: r }))}
                  style={{
                    fontSize: "28px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    opacity: r <= review.rating ? 1 : 0.3,
                    transition: "opacity 0.1s",
                  }}
                >
                  ⭐
                </button>
              ))}
            </div>
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
              Comment (optional)
            </label>
            <textarea
              value={review.comment}
              onChange={(e) =>
                setReview((v) => ({ ...v, comment: e.target.value }))
              }
              placeholder="Share your experience..."
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1.5px solid var(--border)",
                borderRadius: "16px",
                fontSize: "14px",
                fontFamily: "var(--font-body)",
                outline: "none",
                resize: "vertical",
                minHeight: "80px",
              }}
            />
          </div>
          <Button fullWidth onClick={submitReview}>
            Submit Review
          </Button>
        </div>
      </Modal>
    </div>
  );
}
