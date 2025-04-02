

 const validateTimelineEntry = (req, res, next) => {
  const { title, description, date } = req.body;

  if (!title || !description || !date) {
    return res.status(400).json({ message: "Title, description, and date are required" });
  }

  next();
};



module.exports = validateTimelineEntry