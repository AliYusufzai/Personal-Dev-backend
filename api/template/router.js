const router = require("express").Router();
const { create, index, show, destroy } = require("./controller");
const { upload } = require("../../middleware/multerConfig");

router.post("/", upload.array("filePaths", 2), create);
router.get("/", index);
router.get("/:id", show);
router.delete("/:id", destroy);

module.exports = router;
