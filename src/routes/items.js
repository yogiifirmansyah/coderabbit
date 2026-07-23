const express = require("express");
const Joi = require("joi");
const {
  listItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemsController");

const router = express.Router();

const itemSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
});

router.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    const { error } = itemSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  }

  return next();
});

router.get("/", listItems);
router.post("/", createItem);
router.get("/:id", getItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
