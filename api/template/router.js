const router = require("express").Router();
const { fileUpload } = require("./controller");
const { upload } = require("../../middleware/multerConfig");

router.post("/", upload.single("filePath"), fileUpload);

module.exports = router;
