const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRouter = require("./routes/user.route.js");
const errorHandler = require("./middleware/error.middleware.js");

const app = express();

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("Hello from Node API");
});
app.use(errorHandler);

const PORT = 3000;

mongoose
  .connect("mongodb://prachisharma200325:9fOw0jFa8UPlj0Tl@ac-tsiyanj-shard-00-00.qb6in8q.mongodb.net:27017,ac-tsiyanj-shard-00-01.qb6in8q.mongodb.net:27017,ac-tsiyanj-shard-00-02.qb6in8q.mongodb.net:27017/?ssl=true&replicaSet=atlas-yzgl95-shard-0&authSource=admin&appName=Backend")
  .then(() => {
    console.log("Connected to database!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });