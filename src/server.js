require("dotenv").config();
const app = require("./app");
const { initDb } = require("./config/db");

const port = process.env.PORT || 3000;

async function start() {
  try {
    await initDb();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }
}

start();
