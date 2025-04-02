const express  = require ("express");
const TimelineController = require ("../controllers/timelineController");
const authenticate = require ("../middlewares/authMiddleware");
const  { validateTimelineEntry} = require("../middlewares/validationMiddleware") ;


const router = express.Router();

router.get("/",  TimelineController.getAll);
router.get("/:id", TimelineController.getById);
router.post("/",   TimelineController.create);
router.patch("/",  TimelineController.update);
router.delete("/:id",TimelineController.delete);

module.exports = router;
