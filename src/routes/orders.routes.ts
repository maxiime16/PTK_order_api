import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../controllers/orders.controller.js';
import { authenticateToken } from '../lib/auth.js';
import { validateOrder } from '../lib/validateOrder.js';

const router = Router();

router.get('/', getAllOrders);
router.get('/:id', authenticateToken, getOrderById);
router.post('/', authenticateToken, validateOrder, createOrder);
router.put('/:id', authenticateToken, validateOrder, updateOrder);
router.delete('/:id', authenticateToken, deleteOrder);

export default router;
