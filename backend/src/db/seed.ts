import { VerificationStatus, ItemCategory, ItemStatus, RentalStatus } from "@prisma/client";
import { prisma } from "./client";


async function main() {

  // USERS
  const users = await prisma.user.createMany({
    data: [
      {
        id: "user1",
        email: "ram@example.com",
        password: "hashedpassword",
        name: "Ram Sharma",
        phone: "9841234567",
        avatarUrl: "https://i.pravatar.cc/150?img=1",
        verificationStatus: VerificationStatus.VERIFIED,
        averageRating: 4.8,
        totalRatings: 12,
      },
      {
        id: "user2",
        email: "sita@example.com",
        password: "hashedpassword",
        name: "Sita Karki",
        phone: "9812345678",
        avatarUrl: "https://i.pravatar.cc/150?img=5",
        verificationStatus: VerificationStatus.VERIFIED,
        averageRating: 4.9,
        totalRatings: 18,
      },
      {
        id: "user3",
        email: "arjun@example.com",
        password: "hashedpassword",
        name: "Arjun Thapa",
        phone: "9800000000",
        avatarUrl: "https://i.pravatar.cc/150?img=8",
        verificationStatus: VerificationStatus.PENDING,
      },
    ],
  });

  // ITEMS
  const camera = await prisma.item.create({
    data: {
      title: "Canon EOS 80D DSLR Camera",
      description:
        "Perfect DSLR for photography and video shoots. Includes 18-135mm lens, charger, and camera bag. Ideal for weddings, events, and travel photography.",
      category: ItemCategory.ELECTRONICS,
      pricePerDay: 1800,
      depositAmount: 15000,
      images: [
        "https://img.freepik.com/free-vector/guitar-realistic-isolated_1284-4825.jpg?semt=ais_incoming&w=740&q=80",
        "https://img.freepik.com/free-vector/guitar-realistic-isolated_1284-4825.jpg?semt=ais_incoming&w=740&q=80"
      ],
      location: "Kathmandu - Baneshwor",
      status: ItemStatus.AVAILABLE,
      ownerId: "user1",
    },
  });

  const guitar = await prisma.item.create({
    data: {
      title: "Yamaha Acoustic Guitar F310",
      description:
        "Great beginner-friendly acoustic guitar with a rich warm tone. Comes with guitar bag, tuner, and spare strings. Perfect for practice or small performances.",
      category: ItemCategory.MUSICAL_INSTRUMENTS,
      pricePerDay: 500,
      depositAmount: 5000,
      images: [
        "https://images.unsplash.com/photo-1510915361894-db8b60106cb1",
        "https://img.freepik.com/free-vector/guitar-realistic-isolated_1284-4825.jpg?semt=ais_incoming&w=740&q=80", 
        "https://img.freepik.com/free-vector/guitar-realistic-isolated_1284-4825.jpg?semt=ais_incoming&w=740&q=80"
      ],
      location: "Kathmandu - Lalitpur",
      status: ItemStatus.AVAILABLE,
      ownerId: "user2",
    },
  });

  const drone = await prisma.item.create({
    data: {
      title: "DJI Mini 3 Pro Drone",
      description:
        "Ultra-lightweight 4K drone perfect for cinematic shots and travel videos. Includes controller, extra batteries, and carrying case.",
      category: ItemCategory.ELECTRONICS,
      pricePerDay: 3500,
      depositAmount: 25000,
      images: [
        "https://images.unsplash.com/photo-1508614999368-9260051292e5",
        "https://img.freepik.com/free-vector/guitar-realistic-isolated_1284-4825.jpg?semt=ais_incoming&w=740&q=80",
        "https://img.freepik.com/free-vector/guitar-realistic-isolated_1284-4825.jpg?semt=ais_incoming&w=740&q=80"
      ],
      location: "Kathmandu - Thamel",
      status: ItemStatus.AVAILABLE,
      ownerId: "user1",
    },
  });

  const trekkingBag = await prisma.item.create({
    data: {
      title: "70L Trekking Backpack",
      description:
        "Durable 70L trekking backpack suitable for multi-day treks like Everest Base Camp or Annapurna Circuit. Comfortable straps and rain cover included.",
      category: ItemCategory.SPORTS_EQUIPMENT,
      pricePerDay: 350,
      depositAmount: 3000,
      images: [
        "https://img.freepik.com/free-vector/guitar-realistic-isolated_1284-4825.jpg?semt=ais_incoming&w=740&q=80", 
        "https://img.freepik.com/free-vector/guitar-realistic-isolated_1284-4825.jpg?semt=ais_incoming&w=740&q=80"
      ],
      location: "Kathmandu - Thamel",
      status: ItemStatus.AVAILABLE,
      ownerId: "user2",
    },
  });

  // RENTAL
  const rental = await prisma.rental.create({
    data: {
      itemId: camera.id,
      renterId: "user2",
      ownerId: "user1",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-04-03"),
      totalDays: 3,
      rentalAmount: 5400,
      depositAmount: 15000,
      depositPaid: true,
      status: RentalStatus.COMPLETED,
      pickupConditionNote: "Camera working perfectly with no scratches.",
      returnConditionNote: "Returned safely with all accessories.",
    },
  });

  // REVIEW
  await prisma.review.create({
    data: {
      rentalId: rental.id,
      reviewerId: "user2",
      revieweeId: "user1",
      rating: 5,
      comment:
        "Amazing experience! The camera was in perfect condition and Ram was very helpful during pickup.",
    },
  });

  await prisma.review.create({
    data: {
      rentalId: rental.id,
      reviewerId: "user1",
      revieweeId: "user2",
      rating: 5,
      comment:
        "Sita returned the camera on time and handled it very carefully. Highly recommended renter!",
    },
  });

  console.log("✅ Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });