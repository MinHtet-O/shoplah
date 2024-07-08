import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { verify } from "jsonwebtoken";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

@Service() // Register the middleware as a service
@Middleware({ type: "before" })
export class OptionalAuthMiddleware implements ExpressMiddlewareInterface {
  async use(req: any, res: any, next: (err?: any) => any) {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded: any = verify(
          token,
          process.env.JWT_SECRET || "your-secret-key"
        );
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
          where: { id: decoded.userId },
        });
        if (user) {
          req.user = user;
        }
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
    next();
  }
}
