import type { RentalStatus } from "../../types";
import { Badge } from "../ui/Badge";

const STATUS_CONFIG: Record<
  RentalStatus,
  { label: string; bg: string; color: string }
> = {
  PENDING: { label: "⏳ Pending", bg: "#FEF9C3", color: "#854D0E" },
  APPROVED: { label: "✅ Approved", bg: "#DCFCE7", color: "#166534" },
  ACTIVE: { label: "🔑 Active", bg: "#DBEAFE", color: "#1E40AF" },
  RETURN_REQUESTED: {
    label: "↩️ Return Requested",
    bg: "#F3E8FF",
    color: "#6B21A8",
  },
  COMPLETED: { label: "🎉 Completed", bg: "#DCFCE7", color: "#166534" },
  CANCELLED: { label: "❌ Cancelled", bg: "#F1F5F9", color: "#475569" },
  DISPUTED: { label: "⚠️ Disputed", bg: "#FEE2E2", color: "#991B1B" },
};

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  const { label, bg, color } = STATUS_CONFIG[status];
  return (
    <Badge bg={bg} color={color}>
      {label}
    </Badge>
  );
}
