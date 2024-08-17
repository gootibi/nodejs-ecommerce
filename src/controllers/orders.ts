import { Request, Response } from "express";

export const createOrder = async (req: Request, res:Response) => {
    // 1. To create a transaction
    // 2. To list all cart items and proceed if cart is not empty
    // 3. Calculate the total amount
    // 4. Fetch address of user
    // 5. To define computed fields for formatted address on address module
    // 6. We will create a order and order products
    // 7. Create event
};

export const listOrders = async (req: Request, res:Response) => {};

export const cancelOrder = async (req: Request, res:Response) => {};

export const getOrderById = async (req: Request, res:Response) => {};