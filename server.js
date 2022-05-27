const express = require("express");
const dontenv = require("dotenv");

dontenv.config({ path: ".env" });
const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const router = require("./routers/routes");
app.use("/", router);

// Start listening
app.listen(PORT, function () {
  console.log("listening on port " + PORT);
});
