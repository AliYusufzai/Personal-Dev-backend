const router = require("express").Router();
const { show, update, open, updateCss } = require("./controller");

router.get("/:userId", show);
router.post("/", update);
router.patch("/", updateCss);
router.get("/open/:userId", open);

module.exports = router;
