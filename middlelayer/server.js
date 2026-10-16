const express = require("express");
const cors = require("cors");
const db = require("./src/database");
const courseRoutes = require("./src/routes/courseRoutes");
const historyRoutes = require("./src/routes/historyRoutes");
const qnaRoutes = require("./src/routes/qnaRoutes");
const programPlanRoutes = require("./src/routes/programPlanRoutes");
const combinationRoutes = require("./src/routes/combinationRoutes");
const { seedData, exportData } = require("./src/database/seed");

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

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Define constants
const PORT = process.env.PORT || 3000;
let isClosing = false;
let isListening = false;
let server;

// when shutdown is called
const shutdown = async (signal) => {
  if (isClosing) return;
  isClosing = true;

  console.log("close found, exporting database");

  try {
    if (isListening) await exportData();
  } catch (err) {
    console.error("export failed", err);
  } finally {
    if (server) server.close();
    await db.sequelize.close();
    process.exit();
  }

}

//conditions for shutdown (close windows, ctrl c etc)
["SIGINT", "SIGTERM", "SIGHUP"].forEach((sig) => process.on(sig, () => shutdown(sig)));

// Sync database and seed data
db.sync()
  .then(async () => {
    console.log("Database synced successfully");
    await seedData();
    isListening = true;

    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
    process.exit(1);
  });



