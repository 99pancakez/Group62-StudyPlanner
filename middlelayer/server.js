const express = require("express");
const cors = require("cors");
const db = require("./src/database");
const courseRoutes = require("./src/routes/courseRoutes");
const historyRoutes = require("./src/routes/historyRoutes");
const qnaRoutes = require("./src/routes/qnaRoutes");
const programPlanRoutes = require("./src/routes/programPlanRoutes");
const combinationRoutes = require("./src/routes/combinationRoutes");
const { seedData } = require("./src/database/seed");
// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/courses", courseRoutes);
app.use("/history", historyRoutes);
app.use("/qna", qnaRoutes);
app.use("/explorer", programPlanRoutes);
app.use("/combinations", combinationRoutes);



// Sync database and seed data
db.sync()
  .then(async () => {
    console.log("Database synced successfully");
    await seedData();
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
    process.exit(1);
  });

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
