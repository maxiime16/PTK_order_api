import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
});

const orderSchema = z.object({
  clientId: z.string().min(1),
  items: z.array(orderItemSchema).min(1),
  total: z.number().nonnegative(),
  status: z.enum(['PENDING', 'PAID', 'CANCELLED']).optional(), // ou string().optional()
});

export const validateOrder = (req: Request, res: Response, next: NextFunction) => {
  const result = orderSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  next();
};
