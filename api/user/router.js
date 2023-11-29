const router = require("express").Router();
const { signIn } = require("./controller");

router.post("/", signIn);

module.exports = router;
