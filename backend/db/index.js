import { PrismaClient } from '@prisma/client';

let prisma;

try {
    prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });
} catch (error) {
    console.error('Failed to initialize Prisma Client:', error);
    throw error;
}

export const getPrismaClient = () => {
    if (!prisma) {
        throw new Error('Prisma Client not initialized');
    }
    return prisma;
};
