import express from "express";
import { VerifyToken } from "./middleware/VerifyToken.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const STATIC_FILES_PATH = path.resolve(__dirname, "..", "frontend", "build");

// Every time frontend tries to serve this (backend), it will automatically be stored in public folder.
// app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static(path.join(STATIC_FILES_PATH)));

// For later setting environment variables, else we use 3001 as default port.
const port = process.env.PORT || 3001;

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(VerifyToken);

dotenv.config(); // Configure dotenv to access the env variables

app.get("/", (req, res) => {
  console.log("Req found");
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Example Express app listening at http://localhost:${port}`);
});
