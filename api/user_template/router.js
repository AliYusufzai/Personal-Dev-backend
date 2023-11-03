const router = require("express").Router();
const { show } = require("./controller");

router.get("/:userId", show);

module.exports = router;
