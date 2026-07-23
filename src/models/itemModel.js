const { run, get, all } = require("../config/db");

async function findAll() {
  return all("SELECT * FROM items ORDER BY id ASC");
}

async function findById(id) {
  return get("SELECT * FROM items WHERE id = ?", [id]);
}

async function createItem(name) {
  const now = new Date().toISOString();
  const result = await run(
    "INSERT INTO items (name, created_at, updated_at) VALUES (?, ?, ?)",
    [name, now, now]
  );

  return findById(result.id);
}

async function updateItem(id, name) {
  const now = new Date().toISOString();
  await run(
    "UPDATE items SET name = ?, updated_at = ? WHERE id = ?",
    [name, now, id]
  );

  return findById(id);
}

async function deleteItem(id) {
  const item = await findById(id);
  if (!item) return null;

  await run("DELETE FROM items WHERE id = ?", [id]);
  return item;
}

module.exports = {
  findAll,
  findById,
  createItem,
  updateItem,
  deleteItem,
};
