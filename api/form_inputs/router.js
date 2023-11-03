const router = require("express").Router();
const {
    formOne,
    formTwo,
    formThree,
    formFour,
    formFive,
    formSix,
    formSeven,
    formEight,
} = require("./controller");
// const { upload } = require("../../middleware/multerConfig");

router.post("/input-one", formOne);
router.post("/input-two", formTwo);
router.post("/input-three", formThree);
router.post("/input-four", formFour);
router.post("/input-five", formFive);
router.post("/input-six", formSix);
router.post("/input-seven", formSeven);
router.post("/input-eight", formEight);

module.exports = router;
