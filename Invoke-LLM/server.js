import express from "express";
import { generate } from "./chatBot.js";
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to ChatDPT");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const result = await generate(message);

  res.json({ message: result });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// next: add server.js to toolcalling so we can talk to LLM
