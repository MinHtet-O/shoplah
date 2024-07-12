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
import { CategoryController } from "./controllers/CategoryController";
import { OptionalAuthMiddleware } from "./middleware/optionalAuth";
import { PurchaseController } from "./controllers/PurchaseController";
import { DelayMiddleware } from "./middleware/delayMiddleware";
import express, { Request, Response, NextFunction } from "express";
import path from "path";

useContainer(Container);

async function startServer() {
  try {
    await AppDataSource.initialize();

    const app = createExpressServer({
      cors: true,
      controllers: [
        ItemController,
        UserController,
        AuthController,
        CategoryController,
        OfferController,
        PurchaseController,
      ],
      defaultErrorHandler: false,
      middlewares: [ErrorHandler, DelayMiddleware],
      authorizationChecker: authChecker,
      currentUserChecker: currentUserChecker,
    });

    // Serve static files from the 'uploads' directory
    app.use(
      "/uploads",
      express.static(path.resolve(__dirname, "..", "uploads"))
    );

    // Handle any unexpected errors
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      res.status(500).send("Something broke!");
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

async function startFileServer() {
  const fileServer = express();

  // Serve static files from the 'uploads' directory
  fileServer.use("/", express.static(path.resolve(__dirname, "..", "uploads")));

  const fileServerPort = process.env.FILE_SERVER_PORT || 8081;
  fileServer.listen(fileServerPort, () => {
    console.log(`File Server is running on port ${fileServerPort}`);
  });
}

startServer();
startFileServer();
