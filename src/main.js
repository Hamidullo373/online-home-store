import app from "./app.js";
import { APP_PORT } from "./config/app.config.js";
import connectDB from "./config/db.config.js";

const startServer = async () => {
  await connectDB();

  app.listen(APP_PORT, () => {
    console.log(`Server is running on port ${APP_PORT}`);
  });
};

startServer();
