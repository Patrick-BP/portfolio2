const express  = require ("express");
const TimelineController = require ("../controllers/timelineController");
;
const {protect} = require("../middlewares/auth"); // Import your auth middleware


const router = express.Router();

router.get("/",  TimelineController.getAll);
router.get("/:id", TimelineController.getById);
router.post("/",protect,   TimelineController.create);
router.patch("/",protect,  TimelineController.update);
router.delete("/:id",protect, TimelineController.delete);

module.exports = router;
