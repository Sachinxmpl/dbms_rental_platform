import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app";
import { prisma } from "../db/client";

let token: string;
let itemId: string;
const email = `items_${Date.now()}@sajilorent.com`;

beforeAll(async () => {
  await request(app).post("/api/auth/register").send({ email, password: "password123", name: "Item Tester" });
  const res = await request(app).post("/api/auth/login").send({ email, password: "password123" });
  token = res.body.token;
});

afterAll(async () => {
  if (itemId) await prisma.item.deleteMany({ where: { id: itemId } });
  await prisma.user.deleteMany({ where: { email } });
});

describe("Items", () => {
  it("creates an item", async () => {
    const res = await request(app)
      .post("/api/items")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Guitar",
        description: "A test guitar for testing purposes",
        category: "MUSICAL_INSTRUMENTS",
        pricePerDay: 200,
        depositAmount: 2000,
        location: "Thamel",
      });
    expect(res.status).toBe(201);
    itemId = res.body.id;
  });

  it("lists available items", async () => {
    const res = await request(app).get("/api/items");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it("gets item by id", async () => {
    const res = await request(app).get(`/api/items/${itemId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(itemId);
  });
});