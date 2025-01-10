const express = require("express");
const Menu = require("../models/Menu");
const router = express.Router();

// Get all menu items
router.get("/", async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu items." });
  }
});

// Add a new menu item
router.post("/", async (req, res) => {
  const { name, category, price, availability } = req.body;
  if (!name || !category || !price) return res.status(400).json({ message: "All fields are required." });
  try {
    const newMenuItem = new Menu({ name, category, price, availability });
    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding menu item." });
  }
});

// Update a menu item
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category, price, availability } = req.body;
  try {
    const updatedMenuItem = await Menu.findByIdAndUpdate(
      id,
      { name, category, price, availability },
      { new: true }
    );
    res.json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating menu item." });
  }
});

// Delete a menu item
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Menu.findByIdAndDelete(id);
    res.json({ message: "Menu item deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting menu item." });
  }
});

module.exports = router;