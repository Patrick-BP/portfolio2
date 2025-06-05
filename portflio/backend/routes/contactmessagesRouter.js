const express = require ("express");
const  contactmessagesController  = require ("../controllers/contactmessages");
const {protect} = require("../middlewares/auth"); // Import your auth middleware


const router = express.Router();



router.get("/", contactmessagesController.getAll);
router.post("/", contactmessagesController.create);
router.delete("/:id",protect, contactmessagesController.delete);
router.patch("/:id",protect, contactmessagesController.update);


module.exports = router;
