import app from "./app.js";
import { APP_PORT } from "./config/app.config.js";
import connectDB from "./config/mongo.config.js";
import { loginSchema } from "./schema/user.schema.js";

await connectDB();

process.on("unhandledRejection", (reason, promise) => {
  console.log(reason);

  server.closeAllConnections();
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  process.exit(1);
});

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
});
