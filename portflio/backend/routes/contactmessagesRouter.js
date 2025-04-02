const express = require ("express");
const  contactmessagesController  = require ("../controllers/contactmessages");


const router = express.Router();



router.get("/", contactmessagesController.getAll);
router.post("/", contactmessagesController.create);
router.delete("/:id", contactmessagesController.delete);
router.patch("/:id", contactmessagesController.update);


module.exports = router;
