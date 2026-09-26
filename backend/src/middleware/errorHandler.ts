import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../utils/AppError.js'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message, details: err.details })
    return
  }

  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation failed', details: err.flatten() })
    return
  }

  // eslint-disable-next-line no-console
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}

export function notFoundHandler(req: import('express').Request, res: import('express').Response) {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` })
}
