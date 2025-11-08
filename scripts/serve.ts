import express from "express";
import { resolve } from "path";

const dist = resolve(import.meta.dirname, "../dist");

const app = express();

app.use(express.static(dist));

app.use((req, res) => {
  res.sendFile(resolve(dist, "404.html"));
});

app.listen(3000, () => {
  console.log("Application on http://localhost:3000");
});
