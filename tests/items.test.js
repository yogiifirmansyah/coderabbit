const path = require("path");
process.env.DB_PATH = path.join(__dirname, "../data/test.db");

const request = require("supertest");
const { db, initDb } = require("../src/config/db");
const app = require("../src/app");

beforeAll(async () => {
  await initDb();
  await new Promise((resolve, reject) => {
    db.run("DELETE FROM items", (err) => (err ? reject(err) : resolve()));
  });
});

afterAll(async () => {
  await new Promise((resolve, reject) => {
    db.close((err) => (err ? reject(err) : resolve()));
  });
});

describe("SQLite-backed CRUD API", () => {
  it("GET /health returns OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("POST /items creates one item in SQLite", async () => {
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
