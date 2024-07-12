import { Action, UnauthorizedError } from "routing-controllers";
import { verify } from "jsonwebtoken";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

export async function authChecker(action: Action): Promise<boolean> {
  const token = action.request.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return true; // Allow access even if there's no token
  }

  try {
    const decoded: any = verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    const userRepository = AppDataSource.getRepository(User);
    if (!decoded.userId) {
      return true;
    }
    const user = await userRepository.findOne({
      where: { id: decoded.userId },
    });

    if (user) {
      (action.request as any).user = user; // Attach user to request
    }
    return true;
  } catch (error) {
    if ((error as any).name === "TokenExpiredError") {
      throw new UnauthorizedError("login expired. please login again");
    }
    throw error;
  }
}

export async function currentUserChecker(action: Action) {
  return action.request.user;
}
