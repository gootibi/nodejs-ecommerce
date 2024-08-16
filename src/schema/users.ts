import { z } from "zod";

export const SignUpSchema = z.object({
    name: z.string().min(4),
    email: z.string().email(),
    password: z.string().min(6)
});

export const AddressSchema = z.object({
    lineOne: z.string(),
    lineTwo: z.string().nullable(),
    pincode: z.string().length(4),
    country: z.string(),
    city: z.string(),
    userId: z.number().min(1),
});