import { prisma } from "../../db/client";

export const usersService = {
  async getProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, name: true, phone: true,
        avatarUrl: true, verificationStatus: true,
        averageRating: true, totalRatings: true, createdAt: true,
      },
    });
  },

  async updateProfile(userId: string, data: { name?: string; phone?: string; avatarUrl?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, phone: true, avatarUrl: true },
    });
  },

  // In a real app this would validate the uploaded ID with a service
  async submitVerification(userId: string, governmentIdUrl: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { governmentIdUrl, verificationStatus: "PENDING" },
      select: { id: true, verificationStatus: true },
    });
  },

  async getUserPublicProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, avatarUrl: true,
        verificationStatus: true, averageRating: true,
        totalRatings: true, createdAt: true,
        items: { where: { status: "AVAILABLE" }, select: { id: true, title: true, pricePerDay: true, images: true } },
        reviewsReceived: {
          select: { rating: true, comment: true, reviewer: { select: { id: true, name: true } }, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  },
};