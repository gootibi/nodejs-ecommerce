import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { date, number } from "zod";
import { BadRequestsException } from "../exceptions/bad-requests";

export const createOrder = async (req: Request, res: Response) => {
    // 1. To create a transaction
    // 2. To list all cart items and proceed if cart is not empty
    // 3. Calculate the total amount
    // 4. Fetch address of user
    // 5. To define computed fields for formatted address on address module
    // 6. We will create a order and order products
    // 7. Create event
    // 8. To empty cart

    return await prismaClient.$transaction(async (tx) => {
        const cartItem = await tx.cartItem.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                product: true,
            },
        });

        if (cartItem.length === 0) {
            return res.json({ message: 'Cart is empty' });
        }

        const price = cartItem.reduce((prev, current) => {
            return prev + (current.quantity * Number(current.product.price))
        }, 0);

        const address = await tx.address.findFirst({
            where: {
                id: req.user.defaultShippingAddress,
            },
        });

        const order = await tx.order.create({
            data: {
                userId: req.user.id,
                netAmount: price,
                address: address.formattedAddress,
                products: {
                    create: cartItem.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity,
                        }
                    }),
                }
            }
        });

        const orderEvent = await tx.orderEvent.create({
            data: {
                orderId: order.id,
            }
        })

        await tx.cartItem.deleteMany({
            where: {
                userId: req.user.id,
            }
        });

        return res.status(201).json(order);
    });
};

export const listOrders = async (req: Request, res: Response) => {
    const orders = await prismaClient.order.findMany({
        where: {
            userId: req.user.id,

        }
    });

    res.status(200).json(orders);
};

export const cancelOrder = async (req: Request, res: Response) => {

    // 1. Wrap it inside transaction
    // 2. Check if the user is cancelling its own order

    try {
        const order = await prismaClient.order.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                status: "CANCELLED",
            },
        });

        await prismaClient.orderEvent.create({
            data: {
                orderId: order.id,
                status: "CANCELLED",
            },
        });

        res.status(200).json(order);
    } catch (err) {
        throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: Number(req.params.id),
            },
            include: {
                products: true,
                event: true,
            },
        });

        res.status(200).json(order);
    } catch (err) {
        throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
    }
};