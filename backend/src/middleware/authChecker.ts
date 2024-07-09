import { Action } from "routing-controllers";
import { verify } from "jsonwebtoken";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

export async function authChecker(action: Action): Promise<boolean> {
  const token = action.request.headers["authorization"]?.split(" ")[1];
  console.log("");
  console.log("auth checker started123!");
  console.log("token is", token);
  if (!token) {
    return true; // Allow access even if there's no token
  }

  try {
    console.log("before decode");
    const decoded: any = verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    console.log("decoded is", decoded);
    const userRepository = AppDataSource.getRepository(User);
    if (!decoded.userId) {
      return true;
    }
    const user = await userRepository.findOne({
      where: { id: decoded.userId },
    });
    console.log("inside auth checker");
    console.log(user);
    console.log("");
    if (user) {
      (action.request as any).user = user; // Attach user to request
    }
    return true;
  } catch (error) {
    throw error;
  }
}

export async function currentUserChecker(action: Action) {
  return action.request.user;
}
