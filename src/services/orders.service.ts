import { Order } from "../models/Order";

export async function findAllOrders() {
  return Order.find();
}

export async function findOrderById(id: string) {
  return Order.findById(id);
}

export async function createNewOrder(data: any) {
  // Ex: tu peux calculer ici le total si non fourni
  // data.total = data.items?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  return Order.create(data);
}

export async function updateExistingOrder(id: string, data: any) {
  return Order.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function removeOrder(id: string) {
  return Order.findByIdAndDelete(id);
}
