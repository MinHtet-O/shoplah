import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from "routing-controllers";
import { HttpError } from "routing-controllers";
import { Service } from "typedi";
import { ValidationError } from "class-validator";

interface FormattedValidationErrors {
  [key: string]: string[];
}

@Middleware({ type: "after" })
@Service()
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err: any) => any) {
    console.error(error);
    let statusCode = 500;
    let message = "Internal Server Error";
    let errors: FormattedValidationErrors | undefined = undefined;
    if (error.errors) {
      if (
        Array.isArray(error.errors) &&
        error.errors[0] instanceof ValidationError
      ) {
        statusCode = 400;
        message = "Validation Error";
        errors = this.formatValidationErrors(error.errors);
      }
    } else if (error instanceof HttpError) {
      statusCode = error.httpCode;
      message = error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    response.status(statusCode).json({
      status: "error",
      statusCode,
      message,
      ...(errors && { errors }),
    });
  }

  private formatValidationErrors(
    errors: ValidationError[]
  ): FormattedValidationErrors {
    return errors.reduce((acc: FormattedValidationErrors, err) => {
      if (err.constraints) {
        acc[err.property] = Object.values(err.constraints);
      }
      return acc;
    }, {});
  }
}
