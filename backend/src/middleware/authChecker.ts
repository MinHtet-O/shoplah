import { Action } from "routing-controllers";
import { verify } from "jsonwebtoken";
import { UnauthorizedError } from "routing-controllers";

export function authChecker(action: Action): boolean {
  const token = action.request.headers["authorization"]?.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("No token provided");
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET || "your-secret-key");
    (action.request as any).user = decoded;
    return true;
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }
}
