const router = require("express").Router();
const { show, update } = require("./controller");

router.get("/:userId", show);
router.post("/", update);

module.exports = router;
