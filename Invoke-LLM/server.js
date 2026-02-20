import express from "express";
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to ChatDPT");
});

app.post("/chat", (req, res) => {
  const { message } = req.body;

  console.log("message", message);

  res.json({ message: "ok" });
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
