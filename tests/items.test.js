process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/copilot_test";

const request = require("supertest");
const { initDb, run, end } = require("../src/config/db");
const app = require("../src/app");

beforeAll(async () => {
  await initDb();
  await run("DELETE FROM items");
});

afterAll(async () => {
  await end();
});

describe("PostgreSQL-backed CRUD API", () => {
  it("GET /health returns OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("POST /items creates one item in PostgreSQL", async () => {
    const res = await request(app).post("/items").send({ name: "alpha" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: "alpha" });
  });

  it("GET /items returns an array from the database", async () => {
    const res = await request(app).get("/items");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /items/:id returns a stored item", async () => {
    const createRes = await request(app).post("/items").send({ name: "beta" });

    const res = await request(app).get(`/items/${createRes.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ name: "beta" });
  });

  it("PUT /items/:id updates database row", async () => {
    const createRes = await request(app).post("/items").send({ name: "gamma" });

    const res = await request(app)
      .put(`/items/${createRes.body.id}`)
      .send({ name: "updated-gamma" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ name: "updated-gamma" });
  });

  it("DELETE /items/:id removes the row", async () => {
    const createRes = await request(app).post("/items").send({ name: "delta" });

    const res = await request(app).delete(`/items/${createRes.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ name: "delta" });
  });
});
