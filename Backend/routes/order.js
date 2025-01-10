const express = require("express");
const Order = require("../models/Order");
const Menu = require("../models/Menu");
const router = express.Router();

// Place an order
router.post("/", async (req, res) => {
  const { userId, items } = req.body;
  if (!userId || !items || !items.length) return res.status(400).json({ message: "All fields are required." });
  try {
    let totalAmount = 0;
    for (const item of items) {
      const menuItem = await Menu.findById(item.menuItemId);
      if (menuItem) totalAmount += menuItem.price * item.quantity;
    }
    const newOrder = new Order({ userId, items, totalAmount });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Error placing order." });
  }
});

// Get user orders
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId }).populate("items.menuItemId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders." });
  }
});

module.exports = router;