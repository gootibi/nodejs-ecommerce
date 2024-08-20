import { PrismaClient } from '@prisma/client';
import express, { Express } from 'express';
import { errorMiddleware } from './middlewares/errors';
import rootRouter from './routes';
import { PORT } from './secrets';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
    log: ['query'],
}).$extends({
    result: {
        address: {
            formattedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    pincode: true
                },
                compute: (addr) => {
                    return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`
                },
            }
        }
    }
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});