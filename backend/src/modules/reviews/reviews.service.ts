import { prisma } from "../../db/client";

export const reviewsService = {
  async create(rentalId: string, reviewerId: string, data: { revieweeId: string; rating: number; comment?: string }) {
    const rental = await prisma.rental.findUnique({ where: { id: rentalId } });
    if (!rental) throw new Error("Rental not found");
    if (rental.status !== "COMPLETED") throw new Error("Can only review completed rentals");
    if (rental.renterId !== reviewerId && rental.ownerId !== reviewerId) throw new Error("Forbidden");
    if (data.revieweeId !== rental.renterId && data.revieweeId !== rental.ownerId) throw new Error("Invalid reviewee");
    if (data.revieweeId === reviewerId) throw new Error("Cannot review yourself");

    const review = await prisma.review.create({
      data: { rentalId, reviewerId, ...data },
    });

    // Update reviewee average rating
    const allReviews = await prisma.review.findMany({ where: { revieweeId: data.revieweeId } });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.user.update({
      where: { id: data.revieweeId },
      data: { averageRating: Math.round(avg * 10) / 10, totalRatings: allReviews.length },
    });

    return review;
  },
};