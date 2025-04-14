import express from "express"; // express modulini import qilish
import path from "path";
import app from "./app.js";
import { APP_PORT } from "./config/app.config.js";
import connectDB from "./config/mongo.config.js";

// express static fayllarni sozlash
app.use(express.static(path.join(process.cwd(), "public")));

// View engine va views papkasini sozlash
app.set("view engine", "ejs");
app.set("src/views", path.join(process.cwd(), "views"));

async function start() {
  try {
    await connectDB();

    const server = app.listen(APP_PORT, () => {
      console.log(`Server is running on port ${APP_PORT}`);
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.log(reason);
      server.closeAllConnections?.(); // optional chaining
      server.close(() => process.exit(1));
    });

    process.on("uncaughtException", (err) => {
      console.error(err);
      process.exit(1);
    });
  } catch (err) {
    console.error("MongoDB ulanishda xatolik:", err);
    process.exit(1);
  }
}

start();

// import app from "./app.js";
// import { APP_PORT } from "./config/app.config.js";
// import connectDB from "./config/mongo.config.js";
// import { loginSchema } from "./schema/user.schema.js";

// await connectDB();

// process.on("unhandledRejection", (reason, promise) => {
//   console.log(reason);

//   server.closeAllConnections();
//   server.close(() => {
//     process.exit(1);
//   });
// });

// process.on("uncaughtException", (err) => {
//   process.exit(1);
// });

// app.listen(APP_PORT, () => {
//   console.log(`Server is running on port ${APP_PORT}`);
// });
