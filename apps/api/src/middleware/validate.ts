import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type ValidateSource = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, source: ValidateSource = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = getSourceData(req, source);
      const validated = schema.parse(data);
      
      // Replace the source data with validated data
      switch (source) {
        case 'body':
          req.body = validated;
          break;
        case 'query':
          req.query = validated as any;
          break;
        case 'params':
          req.params = validated as any;
          break;
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          error: 'Validation error',
          issues: err.issues,
        });
        return;
      }
      
      next(err);
    }
  };
}

function getSourceData(req: Request, source: ValidateSource): any {
  switch (source) {
    case 'body':
      return req.body;
    case 'query':
      return req.query;
    case 'params':
      return req.params;
    default:
      return {};
  }
}
