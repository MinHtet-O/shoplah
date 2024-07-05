import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import { ItemController } from "./controllers/ItemController";
import { AppDataSource } from "./data-source";

async function startServer() {
  try {
    await AppDataSource.initialize();

    const app = createExpressServer({
      controllers: [ItemController],
    });

    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(
        `Server is running on port ${port} in ${
          process.env.NODE_ENV || "development"
        } mode`
      );
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
