const {
    fileUpload,
    getFile,
    selectColor,
    selectFile,
    selectFont,
    selectProfession,
    backgroundInfo,
    imageUpload,
    updateFile,
    backgroundInfoTwo,
} = require("../controller/templateController");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + "-" + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

router.post("/template-upload", upload.single("filePath"), fileUpload);
router.patch("/template-update/:fileId", upload.single("filePath"), updateFile);
router.post(
    "/template-upload-image/:fileId",
    upload.single("imageUrl"),
    imageUpload
);
// upload.array(["filePath", "imageUrl"]),
router.get("/template-get", getFile);
router.post("/template-select/:userId", selectFile);
router.post("/template-color/:userId", selectColor);
router.post("/template-font/:userId", selectFont);
router.post("/template-prof/:userId", selectProfession);
router.post("/template-backinfo/:userId", backgroundInfo);
router.post("/template-backinfotwo/:userId", backgroundInfoTwo);

module.exports = router;
