const express = require("express");
const router = express.Router();

const {
  getContact,
  updateContact,
} = require("../authcontroller/contactcontroller");

router.get("/contact", getContact);
router.put("/contact", updateContact);

module.exports = router;