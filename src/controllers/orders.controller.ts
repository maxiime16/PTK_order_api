import { Request, Response } from "express";
import {
  findAllOrders,
  findOrderById,
  createNewOrder,
  updateExistingOrder,
  removeOrder,
} from "../services/orders.service";

export async function getAllOrders(req: Request, res: Response) {
  try {
    const orders = await findAllOrders();
    return res.json(orders);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const order = await findOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Commande introuvable" });
    }
    return res.json(order);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function createOrder(req: Request, res: Response) {
  try {
    const newOrder = await createNewOrder(req.body);
    return res.status(201).json(newOrder);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function updateOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updated = await updateExistingOrder(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Commande introuvable" });
    }
    return res.json(updated);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function deleteOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await removeOrder(id);
    if (!deleted) {
      return res.status(404).json({ message: "Commande introuvable" });
    }
    return res.json({ message: "Commande supprimée avec succès" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
