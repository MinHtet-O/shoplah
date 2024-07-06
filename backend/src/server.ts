import "reflect-metadata";
import { createExpressServer, useContainer } from "routing-controllers";
import { Container } from "typedi";
import { ItemController } from "./controllers/ItemController";
import { AppDataSource } from "./data-source";
import { UserController } from "./controllers/UserController";
import { ErrorHandler } from "./middleware/errorHandler";
import { authChecker } from "./middleware/authChecker";
import { AuthController } from "./controllers/AuthController";

// Set up the container
useContainer(Container);

async function startServer() {
  try {
    await AppDataSource.initialize();

    const app = createExpressServer({
      controllers: [ItemController, UserController, AuthController],
      defaultErrorHandler: false,
      middlewares: [ErrorHandler],
      authorizationChecker: authChecker,
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
