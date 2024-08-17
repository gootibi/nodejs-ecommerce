import { Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { CartItem, Product } from "@prisma/client";
import { prismaClient } from "..";
import { BadRequestsException } from "../exceptions/bad-requests";

export const addItemToCart = async (req: Request, res: Response) => {

    const validateDate = CreateCartSchema.parse(req.body);
    let product: Product;
    try {

        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validateDate.productId,
            },
        });

    } catch (error) {
        throw new NotFoundException('Product not found!', ErrorCode.PRODUCT_NOT_FOUND);
    }

    // const cart = await prismaClient.cartItem.findFirst({
    //     where: {
    //         productId: product.id,
    //         userId: req.user.id,
    //     }
    // });

    // if (cart) {
    //     await prismaClient.cartItem.update({
    //         where: {
    //             id: cart.id,
    //             userId: req.user.id,
    //             productId: product.id,
    //         },
    //         data: {
    //             quantity: validateDate.quantity + cart.quantity,
    //         }
    //     });
    //     console.log("if")
    // } else {
    //     console.log("else")
    //     await prismaClient.cartItem.create({
    //         data: {
    //             userId: req.user.id,
    //             productId: product.id,
    //             quantity: validateDate.quantity,
    //         }
    //     });
    // } 

    // res.status(201).json(cart);

    // Check for the exsistence of the some product in user's cart and alert the quantity as required

    await prismaClient.cartItem.create({
        data: {
            userId: req.user.id,
            productId: product.id,
            quantity: validateDate.quantity,
        }
    });

    const userCart = await prismaClient.cartItem.findMany({
        where: {
            userId: req.user.id,
        }
    });

    res.status(200).json(userCart);
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
    // Check if user is deleting its own cart item
    try {
        await prismaClient.cartItem.delete({
            where: {
                id: Number(req.params.id),
                userId: req.user.id,
            },
        });

        res.status(200).json({ success: true });
    } catch (error) {
        throw new NotFoundException('Cart not found!', ErrorCode.CART_NOT_FOUND);
    }
};

export const changeQuantity = async (req: Request, res: Response) => {
    // Check if user is updating its own cart item
    try {

        const validateData = ChangeQuantitySchema.parse(req.body);

        const updatedCart = await prismaClient.cartItem.update({
            where: {
                id: Number(req.params.id),
                userId: req.user.id,
            },
            data: {
                quantity: validateData.quantity,
            },
        });

        res.status(200).send(updatedCart);

    } catch (error) {
        throw new BadRequestsException('Product not found', ErrorCode.PRODUCT_NOT_FOUND);
    }

};

export const getCart = async (req: Request, res: Response) => {
    const cart = await prismaClient.cartItem.findMany({
        where: {
            userId: req.user.id,
        },
        include: {
            product: true,
        },
    });

    res.status(200).json(cart);
};