import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { prisma } from "../../db/client";
import { env } from "../../config/env";

export const authService = {
  async register(data: { email: string; password: string; name: string; phone?: string }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error("Email already in use");

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: { ...data, password: hashed },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        verificationStatus: true,
        createdAt: true,
      },
    });

    return user;
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { userId: user.id },
      env.JWT_SECRET as string,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );

    const { password: _, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
  },
};