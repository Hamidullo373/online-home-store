import express from "express";
import route from "./routes/index.js";
import { config } from "dotenv";

import path from "path";
import cookieParser from "cookie-parser";
import pageRouter from "./routes/page.route.js";
import { fileURLToPath } from "url";
import { BaseException } from "./exception/base.exseption.js";
import { ErrorHandlerMiddleware } from "./middleware/error.middleware.js";
import methodOverride from "method-override";
import morgan from "morgan";

config();

const app = express();

if (process.env.NODE_ENV?.trim() === "development") {
  app.use(morgan("tiny"));
}

app.use(methodOverride("_method"));
app.use(morgan("tiny"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "views"));
app.use("/uploads", express.static("uploads"));

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser("cookie-secret"));

app.use("/", pageRouter);
app.use("/", route);

app.all("/*", (req, res, next) => {
  res.render("404");
});

app.use(ErrorHandlerMiddleware);

export default app;
