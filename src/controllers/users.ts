import { Address } from "@prisma/client";
import { Request, Response } from "express";
import { prismaClient } from "..";
import { BadRequestsException } from "../exceptions/bad-requests";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { AddressSchema, UpdateUserSchema } from "../schema/users";

export const addAddress = async (req: Request, res: Response) => {
    AddressSchema.parse(req.body);

    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            userId: req.user.id,
        }
    });

    res.json(address);
};

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        await prismaClient.address.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        res.status(200).json({ success: true });
    } catch (error) {
        throw new NotFoundException('Address not found!', ErrorCode.ADDRESS_NOT_FOUND);
    }
};

export const listAddress = async (req: Request, res: Response) => {
    const addresses = await prismaClient.address.findMany({
        where: {
            userId: req.user.id,
        }
    });
    res.status(200).json(addresses);
};

export const updateUser = async (req: Request, res: Response) => {
    console.log('Run')
    const validatedData = UpdateUserSchema.parse(req.body);
    let shippingAddress: Address;
    let billingAddress: Address;

    if (validatedData.defaultShippingAddress) {
        try {

            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress,
                },
            });

        } catch (error) {
            throw new NotFoundException('Address not found!', ErrorCode.ADDRESS_NOT_FOUND);
        }

        if (shippingAddress.userId !== req.user.id) {
            throw new BadRequestsException('Address does not belong to the user', ErrorCode.ADDRESS_DOES_NOT_BELONG);
        }

    }

    if (validatedData.defaultBillingAddress) {
        try {

            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress,
                },
            });

        } catch (error) {
            throw new NotFoundException('Address not found!', ErrorCode.ADDRESS_NOT_FOUND);
        }

        if (billingAddress.userId !== req.user.id) {
            throw new BadRequestsException('Address does not belong to the user', ErrorCode.ADDRESS_DOES_NOT_BELONG);
        }
    }

    const updateUser = await prismaClient.user.update({
        where: {
            id: req.user.id,
        },
        data: validatedData
    });

    res.status(200).json(updateUser);
};

export const listUsers = async (req: Request, res: Response) => {
    const users = await prismaClient.user.findMany({
        skip: Number(req.query.ski) || 0,
        take: 5,
    });

    res.status(200).json(users);
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await prismaClient.user.findFirstOrThrow({
            where: {
                id: Number(req.params.id),
            },
            include: {
                address: true,
            },
        });

        res.status(200).json(user);
    } catch (err) {
        throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
    }
};

export const changeUserRole = async (req: Request, res: Response) => {
    // Validation
    try {
        const user = await prismaClient.user.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                role: req.body.role
            }
        });

        res.status(200).json(user);
    } catch (err) {
        throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
    }
};