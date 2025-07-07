import {
  findAllOrders,
  findOrderById,
  createNewOrder,
  updateExistingOrder,
  removeOrder,
} from '../../src/services/orders.service.js';

import { Order } from '../../src/models/Order.js';

jest.mock('../../src/models/Order');

describe('Order Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllOrders', () => {
    it('should return all orders', async () => {
      const mockOrders = [{ id: '1' }, { id: '2' }];
      (Order.find as jest.Mock).mockResolvedValue(mockOrders);

      const result = await findAllOrders();
      expect(Order.find).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });
  });

  describe('findOrderById', () => {
    it('should return the order by ID', async () => {
      const mockOrder = { id: '1', item: 'test' };
      (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

      const result = await findOrderById('1');
      expect(Order.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockOrder);
    });
  });

  describe('createNewOrder', () => {
    it('should create a new order', async () => {
      const data = { item: 'item1', total: 100 };
      const mockCreatedOrder = { id: '123', ...data };
      (Order.create as jest.Mock).mockResolvedValue(mockCreatedOrder);

      const result = await createNewOrder(data);
      expect(Order.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockCreatedOrder);
    });
  });

  describe('updateExistingOrder', () => {
    it('should update an existing order', async () => {
      const id = '123';
      const data = { item: 'updatedItem' };
      const mockUpdated = { id, ...data };

      (Order.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdated);

      const result = await updateExistingOrder(id, data);
      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(id, data, {
        new: true,
        runValidators: true,
      });
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('removeOrder', () => {
    it('should delete an order', async () => {
      const id = '456';
      const mockDeleted = { id };
      (Order.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDeleted);

      const result = await removeOrder(id);
      expect(Order.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockDeleted);
    });
  });
});
