import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      // Create an object to parse containing body, query, and params
      // The schema passed should expect this structure.
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next({
          statusCode: 400,
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          details: error.flatten(),
          name: 'AppError',
        } as unknown as Error);
        return;
      }
      next(error);
    }
  };
}
