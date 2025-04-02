const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path"); // Import path module
const multer = require('multer');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json()); // Removed global JSON parser - apply specifically where needed
app.use('/public', express.static(path.join(__dirname, '/public'))); // Serve static files from uploads directory

const usersRouter = require("./routes/usersRouter");
const profilesRouter = require("./routes/profileRouter");
const contactmessagesRouter = require("./routes/contactmessagesRouter");
const blogpostsRouter = require("./routes/blogpostsRouter");
const timelineentriesRouter = require("./routes/timelineRouter");
const projectRouter = require('./routes/projectsRouter');
const skillRouter = require("./routes/skillsRouter");
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use("/api/users", usersRouter);
app.use("/api/projects", projectRouter);
app.use("/api/profiles", profilesRouter);
app.use("/api/contactmessages", contactmessagesRouter);
app.use("/api/blogposts", blogpostsRouter);
app.use("/api/timeline", timelineentriesRouter);
app.use("/api/skills", skillRouter);




mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(err => {
    console.log(err);
});


