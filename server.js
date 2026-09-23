require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");

const connectDB = require("./config/db");

const app = express();

connectDB();
//middleware
app.use(cors());
app.use(express.json());

//routes
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");

const interviewRoutes = require("./routes/interviewRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/interviews", interviewRoutes);

//test route
app.get('/', (req, res) => {
    res.json({
        sucess: true,
        message: 'AI interview prep is running'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});