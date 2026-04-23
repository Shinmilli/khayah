/**
 * Allows the server to boot without a `DATABASE_URL`.
 *
 * IMPORTANT:
 * - `@prisma/client` is conditionally loaded to avoid runtime failures when the
 *   Prisma Client hasn't been generated yet (common during early setup).
 */
import type { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient | null;
//# sourceMappingURL=prisma.d.ts.map