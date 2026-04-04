import { prisma } from "../../db/client";
import { ItemCategory } from "@prisma/client"

interface ItemQuery {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  limit: number;
}

export const itemsService = {
  async create(ownerId: string, data: {
    title: string; description: string; category: ItemCategory;
    pricePerDay: number; depositAmount: number; images: string[]; location: string;
  }) {
    return prisma.item.create({ data: { ...data, ownerId } });
  },

  async list(query: ItemQuery) {
    const { category, location, minPrice, maxPrice, page, limit } = query;
    const skip = (page - 1) * limit;

    const where = {
      status: "AVAILABLE" as const,
      ...(category && { category: category as ItemCategory }),
      ...(location && { location: { contains: location, mode: "insensitive" as const } }),
      ...(minPrice !== undefined || maxPrice !== undefined) && {
        pricePerDay: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      },
    };

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where, skip, take: limit,
        include: { owner: { select: { id: true, name: true, averageRating: true, verificationStatus: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.item.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    return prisma.item.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, averageRating: true, verificationStatus: true, avatarUrl: true } },
        rentals: {
          where: { status: { in: ["ACTIVE", "APPROVED"] } },
          select: { startDate: true, endDate: true },
        },
      },
    });
  },

  async update(id: string, ownerId: string, data: Partial<{ title: string; description: string; pricePerDay: number; depositAmount: number; images: string[]; location: string; status: "AVAILABLE" | "UNAVAILABLE" }>) {
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) throw new Error("Item not found");
    if (item.ownerId !== ownerId) throw new Error("Forbidden");
    return prisma.item.update({ where: { id }, data });
  },

  async delete(id: string, ownerId: string) {
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) throw new Error("Item not found");
    if (item.ownerId !== ownerId) throw new Error("Forbidden");
    const activeRental = await prisma.rental.findFirst({ where: { itemId: id, status: { in: ["ACTIVE", "APPROVED", "PENDING"] } } });
    if (activeRental) throw new Error("Cannot delete item with active rentals");
    return prisma.item.delete({ where: { id } });
  },
};