import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";

@Middleware({ type: "before" })
@Service()
export class DelayMiddleware implements ExpressMiddlewareInterface {
  use(request: any, response: any, next: (err?: any) => any): void {
    const delay = 500; // delay in milliseconds (e.g., 2000ms = 2 seconds)
    setTimeout(() => {
      next();
    }, delay);
  }
}
