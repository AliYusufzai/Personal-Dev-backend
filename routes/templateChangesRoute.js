const express = require("express");
const router = express.Router();
const {
    getUserTemplate,
    updateUserTemplate,
    openUserTemplate,
    getUserSpecificTemplate,
    displayUserSpecificTemplate
} = require("../controller/templateChangesController");


router.get("/get-file/:userId", getUserTemplate);
router.patch("/update-file/:userId", updateUserTemplate);
router.get("/open-file/:userId", openUserTemplate);
router.get("/get-user-specific-file/:userId", getUserSpecificTemplate)
router.get("/display-user-specific-file", displayUserSpecificTemplate)


module.exports = router;
