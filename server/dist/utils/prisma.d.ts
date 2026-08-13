/**
 * Allows the server to boot without a `DATABASE_URL`.
 *
 * IMPORTANT:
 * - `@prisma/client` is conditionally loaded to avoid runtime failures when the
 *   Prisma Client hasn't been generated yet (common during early setup).
 */
export type PrismaInitStatus = {
    ok: boolean;
    reason?: 'mock_data' | 'missing_database_url' | 'init_failed';
    message?: string;
};
export declare let prismaInitStatus: PrismaInitStatus;
export declare const prisma: any | null;
//# sourceMappingURL=prisma.d.ts.map