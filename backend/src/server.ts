import "reflect-metadata";
import { createExpressServer, useContainer } from "routing-controllers";
import { Container } from "typedi";
import { ItemController } from "./controllers/ItemController";
import { AppDataSource } from "./data-source";

// Set up the container
useContainer(Container);

async function startServer() {
  try {
    await AppDataSource.initialize();

    const app = createExpressServer({
      controllers: [ItemController],
      defaultErrorHandler: false,
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
