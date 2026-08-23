const express = require("express");
const router = express.Router();

const {
  addCategory,
  getCategories,
} = require("../authcontroller/categorycontroller");

router.post("/add-category", addCategory);
router.get("/categories", getCategories);

module.exports = router;