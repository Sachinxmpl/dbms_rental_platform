import "dotenv/config"
import { prisma } from "./client";
import bcrypt from "bcryptjs";
import { ItemCategory } from "@prisma/client"

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      password,
      name: "Alice Tamang",
      phone: "9841000001",
      verificationStatus: "VERIFIED",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      password,
      name: "Bob Shrestha",
      phone: "9841000002",
      verificationStatus: "VERIFIED",
    },
  });

  await prisma.item.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "Yamaha Acoustic Guitar",
        description: "Great condition Yamaha F310, perfect for beginners.",
        category: ItemCategory.MUSICAL_INSTRUMENTS,
        pricePerDay: 200,
        depositAmount: 2000,
        images: [],
        location: "Thamel, Kathmandu",
        ownerId: alice.id,
      },
      {
        title: "Canon EOS 200D Camera",
        description: "DSLR camera with 18-55mm kit lens.",
        category: ItemCategory.ELECTRONICS,
        pricePerDay: 500,
        depositAmount: 15000,
        images: [],
        location: "Lazimpat, Kathmandu",
        ownerId: bob.id,
      },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());