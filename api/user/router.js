const router = require("express").Router();
const { signIn } = require("./controller");

router.post("/signin", signIn);

module.exports = router;
