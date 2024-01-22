const router = require("express").Router();
const {
    show,
    update,
    open,
    display,
    updateCss,
    makeStyleChangesInUserTemplate,
} = require("./controller");

router.get("/:userId", show);
router.post("/", update);
router.patch("/", updateCss);
router.get("/open/:templateId", open);
router.get("/display/:userId", display);
router.patch("/change/", makeStyleChangesInUserTemplate);

module.exports = router;
