import { z } from "zod";

export const SignUpSchema = z.object({
    name: z.string().min(4),
    email: z.string().email(),
    password: z.string().min(6)
});