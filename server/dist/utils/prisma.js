"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const connectionString = process.env.DATABASE_URL;
exports.prisma = (() => {
    if (process.env.MOCK_DATA === 'true')
        return null;
    if (!connectionString)
        return null;
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { PrismaClient: PrismaClientRuntime } = require('@prisma/client');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { PrismaPg } = require('@prisma/adapter-pg');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pg = require('pg');
        const pool = new pg.Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        return new PrismaClientRuntime({ adapter });
    }
    catch (error) {
        console.warn('[WARN] Prisma client could not be initialized. Falling back to mock data. Set MOCK_DATA=true to silence this warning.', error);
        return null;
    }
})();
//# sourceMappingURL=prisma.js.map