const express = require("express");
const router = express.Router();
const { formOne, formTwo } = require("../controller/formOneController");

router.post("/add", formOne);
router.post("/add/:userId", formTwo);

module.exports = router;
