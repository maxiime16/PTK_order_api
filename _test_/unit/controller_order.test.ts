import { Request, Response } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../../src/controllers/orders.controller.js';

import * as orderService from '../../src/services/orders.service.js';
import * as orderPublisher from '../../src/services/orderPublisher.js';

jest.mock('../../src/services/orders.service');
jest.mock('../../src/services/orderPublisher');

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Order Controller', () => {
  const mockReq = {} as Request;
  let res: Response;

  beforeEach(() => {
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      const fakeOrders = [{ id: '1', item: 'test' }];
      (orderService.findAllOrders as jest.Mock).mockResolvedValue(fakeOrders);

      await getAllOrders(mockReq, res);
      expect(res.json).toHaveBeenCalledWith(fakeOrders);
    });

    it('should handle error', async () => {
      (orderService.findAllOrders as jest.Mock).mockRejectedValue(new Error('Erreur'));
      await getAllOrders(mockReq, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erreur' });
    });
  });

  describe('getOrderById', () => {
    it('should return order if found', async () => {
      const fakeOrder = { id: '1' };
      const req = { params: { id: '1' } } as unknown as Request;
      (orderService.findOrderById as jest.Mock).mockResolvedValue(fakeOrder);

      await getOrderById(req, res);
      expect(res.json).toHaveBeenCalledWith(fakeOrder);
    });

    it('should return 404 if not found', async () => {
      const req = { params: { id: '999' } } as unknown as Request;
      (orderService.findOrderById as jest.Mock).mockResolvedValue(null);

      await getOrderById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Commande introuvable' });
    });
  });

  describe('createOrder', () => {
    it('should create a new order and publish it', async () => {
      const req = { body: { item: 'test' } } as Request;
      const newOrder = { id: '123', item: 'test' };
      (orderService.createNewOrder as jest.Mock).mockResolvedValue(newOrder);
      (orderPublisher.publishOrderCreated as jest.Mock).mockResolvedValue(undefined);

      await createOrder(req, res);
      expect(orderService.createNewOrder).toHaveBeenCalledWith(req.body);
      expect(orderPublisher.publishOrderCreated).toHaveBeenCalledWith(newOrder);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newOrder);
    });

    it('should handle error', async () => {
      const req = { body: {} } as Request;
      (orderService.createNewOrder as jest.Mock).mockRejectedValue(new Error('Invalid'));

      await createOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid' });
    });
  });

  describe('updateOrder', () => {
    it('should update order', async () => {
      const req = {
        params: { id: '1' },
        body: { item: 'updated' },
      } as unknown as Request;

      const updatedOrder = { id: '1', item: 'updated' };
      (orderService.updateExistingOrder as jest.Mock).mockResolvedValue(updatedOrder);

      await updateOrder(req, res);
      expect(res.json).toHaveBeenCalledWith(updatedOrder);
    });

    it('should return 404 if order not found', async () => {
      const req = { params: { id: '999' }, body: {} } as unknown as Request;
      (orderService.updateExistingOrder as jest.Mock).mockResolvedValue(null);

      await updateOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Commande introuvable' });
    });
  });

  describe('deleteOrder', () => {
    it('should delete the order', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      (orderService.removeOrder as jest.Mock).mockResolvedValue(true);

      await deleteOrder(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Commande supprimée avec succès' });
    });

    it('should return 404 if not found', async () => {
      const req = { params: { id: '999' } } as unknown as Request;
      (orderService.removeOrder as jest.Mock).mockResolvedValue(false);

      await deleteOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Commande introuvable' });
    });
  });
});
