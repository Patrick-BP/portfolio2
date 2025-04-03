const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path"); // Import path module
const {protect} = require("./middlewares/auth"); // Import your auth middleware

const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());  // Make sure this is before routes
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json()); // Removed global JSON parser - apply specifically where needed
app.use('/public', express.static(path.join(__dirname, '/public'))); // Serve static files from uploads directory



const authRouter = require("./routes/authRouter");
const profilesRouter = require("./routes/profileRouter");
const contactmessagesRouter = require("./routes/contactmessagesRouter");
const blogpostsRouter = require("./routes/blogpostsRouter");
const timelineentriesRouter = require("./routes/timelineRouter");
const projectRouter = require('./routes/projectsRouter');
const skillRouter = require("./routes/skillsRouter");
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/profiles", profilesRouter);
app.use("/api/contactmessages", contactmessagesRouter);
app.use("/api/blogposts", blogpostsRouter);
app.use("/api/timeline", timelineentriesRouter);
app.use("/api/skills", skillRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



