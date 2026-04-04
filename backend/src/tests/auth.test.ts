import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app";
import { prisma } from "../db/client";

const testEmail = `test_${Date.now()}@sajilorent.com`;

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: testEmail } });
});

describe("Auth", () => {
  it("registers a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: testEmail,
      password: "password123",
      name: "Test User",
    });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(testEmail);
  });

  it("rejects duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: testEmail,
      password: "password123",
      name: "Test User",
    });
    expect(res.status).toBe(500); // hits errorHandler
  });

  it("logs in and returns token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "password123",
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects bad password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "wrongpass",
    });
    expect(res.status).toBe(500);
  });
});