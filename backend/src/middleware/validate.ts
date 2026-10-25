import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errorHandler.js';

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
        // Must be a real AppError: errorHandler only maps `instanceof AppError` to its status code,
        // so a plain object here used to surface as a 500 INTERNAL_ERROR.
        next(new AppError(400, 'Validation error', 'VALIDATION_ERROR', error.flatten()));
        return;
      }
      next(error);
    }
  };
}
