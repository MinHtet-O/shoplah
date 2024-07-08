import "reflect-metadata";
import { createExpressServer, useContainer } from "routing-controllers";
import { Container } from "typedi";
import { ItemController } from "./controllers/ItemController";
import { AppDataSource } from "./data-source";
import { UserController } from "./controllers/UserController";
import { ErrorHandler } from "./middleware/errorHandler";
import { authChecker, currentUserChecker } from "./middleware/authChecker"; // Import the authChecker and currentUserChecker
import { AuthController } from "./controllers/AuthController";
import { OfferController } from "./controllers/OfferController";
import { Category } from "./entity/Category";
import { CategoryController } from "./controllers/CategoryController";
import { OptionalAuthMiddleware } from "./middleware/optionalAuth";

useContainer(Container);

async function startServer() {
  try {
    await AppDataSource.initialize();

    const app = createExpressServer({
      controllers: [
        ItemController,
        UserController,
        AuthController,
        CategoryController,
        OfferController,
      ],
      defaultErrorHandler: false,
      middlewares: [ErrorHandler],
      authorizationChecker: authChecker,
      currentUserChecker: currentUserChecker,
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
