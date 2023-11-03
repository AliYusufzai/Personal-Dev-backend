const router = require("express").Router();
const { formEight } = require("./controller");

router.post("/input-eight", formEight);

module.exports = router;
