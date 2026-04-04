import { prisma } from "../../db/client";
import { RentalStatus } from "@prisma/client";

export const rentalsService = {
  async create(renterId: string, data: { itemId: string; startDate: Date; endDate: Date }) {
    const item = await prisma.item.findUnique({ where: { id: data.itemId } });
    if (!item) throw new Error("Item not found");
    if (item.status !== "AVAILABLE") throw new Error("Item is not available");
    if (item.ownerId === renterId) throw new Error("You cannot rent your own item");

    // Check renter is verified
    const renter = await prisma.user.findUnique({ where: { id: renterId } });
    if (renter?.verificationStatus !== "VERIFIED") throw new Error("You must be verified to rent items");

    // Check for conflicting rentals
    const conflict = await prisma.rental.findFirst({
      where: {
        itemId: data.itemId,
        status: { in: ["APPROVED", "ACTIVE"] },
        OR: [
          { startDate: { lte: data.endDate }, endDate: { gte: data.startDate } },
        ],
      },
    });
    if (conflict) throw new Error("Item is already booked for these dates");

    const msPerDay = 1000 * 60 * 60 * 24;
    const totalDays = Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / msPerDay);
    const rentalAmount = item.pricePerDay * totalDays;

    return prisma.rental.create({
      data: {
        itemId: data.itemId,
        renterId,
        ownerId: item.ownerId,
        startDate: data.startDate,
        endDate: data.endDate,
        totalDays,
        rentalAmount,
        depositAmount: item.depositAmount,
      },
      include: { item: { select: { title: true } }, renter: { select: { name: true } } },
    });
  },

  async updateStatus(rentalId: string, userId: string, action: string, meta?: { note?: string; conditionNote?: string; conditionImages?: string[] }) {
    const rental = await prisma.rental.findUnique({ where: { id: rentalId } });
    if (!rental) throw new Error("Rental not found");

    const isOwner = rental.ownerId === userId;
    const isRenter = rental.renterId === userId;

    // State machine
    const transitions: Record<string, { from: RentalStatus[]; allowedBy: "owner" | "renter" | "both"; to: RentalStatus }> = {
      approve:         { from: ["PENDING"],           allowedBy: "owner",  to: "APPROVED" },
      reject:          { from: ["PENDING"],            allowedBy: "owner",  to: "CANCELLED" },
      cancel:          { from: ["PENDING","APPROVED"], allowedBy: "both",   to: "CANCELLED" },
      pay_deposit:     { from: ["APPROVED"],           allowedBy: "renter", to: "ACTIVE" },
      confirm_return:  { from: ["RETURN_REQUESTED"],   allowedBy: "owner",  to: "COMPLETED" },
      dispute:         { from: ["RETURN_REQUESTED"],   allowedBy: "owner",  to: "DISPUTED" },
      request_return:  { from: ["ACTIVE"],             allowedBy: "renter", to: "RETURN_REQUESTED" },
    };

    const t = transitions[action];
    if (!t) throw new Error("Invalid action");
    if (!t.from.includes(rental.status)) throw new Error(`Cannot ${action} a rental in ${rental.status} status`);
    if (t.allowedBy === "owner" && !isOwner) throw new Error("Only the owner can perform this action");
    if (t.allowedBy === "renter" && !isRenter) throw new Error("Only the renter can perform this action");
    if (t.allowedBy === "both" && !isOwner && !isRenter) throw new Error("Forbidden");

    const updateData: Record<string, unknown> = { status: t.to };

    if (action === "approve" || action === "reject") updateData.ownerNote = meta?.note;
    if (action === "cancel") updateData.cancellationReason = meta?.note;
    if (action === "pay_deposit") updateData.depositPaid = true;
    if (action === "confirm_return") {
      updateData.depositReleased = true;
      updateData.returnConditionNote = meta?.conditionNote;
      updateData.returnConditionImages = meta?.conditionImages ?? [];
    }
    if (action === "approve") {
      // When owner approves, capture pickup condition
      updateData.pickupConditionNote = meta?.conditionNote;
      updateData.pickupConditionImages = meta?.conditionImages ?? [];
    }

    const updated = await prisma.rental.update({
      where: { id: rentalId },
      data: updateData,
    });

    // Mark item as rented when active, available when completed/cancelled
    if (t.to === "ACTIVE") {
      await prisma.item.update({ where: { id: rental.itemId }, data: { status: "RENTED" } });
    }
    if (t.to === "COMPLETED" || t.to === "CANCELLED") {
      await prisma.item.update({ where: { id: rental.itemId }, data: { status: "AVAILABLE" } });
    }

    return updated;
  },

  async getMyRentals(userId: string, role: "renter" | "owner") {
    const where = role === "renter" ? { renterId: userId } : { ownerId: userId };
    return prisma.rental.findMany({
      where,
      include: {
        item: { select: { id: true, title: true, images: true } },
        renter: { select: { id: true, name: true, averageRating: true } },
        owner: { select: { id: true, name: true, averageRating: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(rentalId: string, userId: string) {
    const rental = await prisma.rental.findUnique({
      where: { id: rentalId },
      include: {
        item: true,
        renter: { select: { id: true, name: true, averageRating: true, verificationStatus: true } },
        owner: { select: { id: true, name: true, averageRating: true } },
        reviews: true,
      },
    });
    if (!rental) throw new Error("Rental not found");
    if (rental.renterId !== userId && rental.ownerId !== userId) throw new Error("Forbidden");
    return rental;
  },
};