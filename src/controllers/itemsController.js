const itemModel = require("../models/itemModel");

async function listItems(req, res, next) {
  try {
    const items = await itemModel.findAll();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function createItem(req, res, next) {
  try {
    const item = await itemModel.createItem(req.body.name);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

async function getItem(req, res, next) {
  try {
    const item = await itemModel.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const item = await itemModel.updateItem(req.params.id, req.body.name);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

async function deleteItem(req, res, next) {
  try {
    const deleted = await itemModel.deleteItem(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
};
