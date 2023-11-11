import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import sensoryRouter from "./routes/sensory.js";

const app = express();

const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cache Images
const ONE_DAY_IN_MILLISECONDS = 86400000;

app.use(
  "/images",
  express.static(join(__dirname, "../frontend/public/images"), {
    maxAge: ONE_DAY_IN_MILLISECONDS * 7,
  })
);

app.use(express.static(join(__dirname, "../frontend/public")));

app.get("/", (req, res) => {
  res.redirect("/sensory");
});

app.use("/sensory", sensoryRouter);

app.get("/contact", (req, res) => {
  res.send("This page is a work in progress");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
