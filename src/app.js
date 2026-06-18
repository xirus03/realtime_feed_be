import express from "express";
import cors from "cors";

import routes from "./routes/index.js";

const app = express();


app.use(cors());
app.use(express.json());
app.use("/api", routes);


app.get("/", (req, res) => {
  return res.send("Docker container is running with Express.");
});

export default app;