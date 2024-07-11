import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { Service } from "typedi";

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, path.resolve(__dirname, "..", "..", "temp")); // Temporary directory
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

@Middleware({ type: "before" })
@Service()
export class MulterMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return next(err);
      }
      if (req.body.data) {
        try {
          req.body = JSON.parse(req.body.data);
        } catch (jsonError) {
          return res.status(400).json({ error: "Invalid JSON data" });
        }
      }
      next();
    });
  }
}
