"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJsonDocument = readJsonDocument;
exports.writeJsonDocument = writeJsonDocument;
exports.readJsonDocumentOptional = readJsonDocumentOptional;
exports.deleteJsonDocument = deleteJsonDocument;
const prisma_1 = require("../utils/prisma");
const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS "site_documents" (
  "key" VARCHAR(64) NOT NULL,
  "body" JSONB NOT NULL,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "site_documents_pkey" PRIMARY KEY ("key")
);
`;
let tableReady = null;
async function ensureTable() {
    if (!prisma_1.prisma)
        return;
    if (!tableReady) {
        tableReady = prisma_1.prisma
            .$executeRawUnsafe(CREATE_TABLE_SQL)
            .then(() => undefined)
            .catch((error) => {
            tableReady = null;
            throw error;
        });
    }
    await tableReady;
}
function requirePrisma() {
    if (!prisma_1.prisma) {
        const err = new Error('Database unavailable');
        err.status = 503;
        throw err;
    }
    return prisma_1.prisma;
}
/** 관리자 설정 문서는 DB에만 있다. 행이 없으면 예외를 던진다. */
async function readJsonDocument(key) {
    const db = requirePrisma();
    await ensureTable();
    const row = await db.siteDocument.findUnique({ where: { key } });
    if (row?.body == null) {
        const err = new Error(`Missing site document: ${key}`);
        err.status = 404;
        throw err;
    }
    return row.body;
}
async function writeJsonDocument(key, body) {
    const db = requirePrisma();
    await ensureTable();
    await db.siteDocument.upsert({
        where: { key },
        create: { key, body },
        update: { body },
    });
}
async function readJsonDocumentOptional(key) {
    try {
        return await readJsonDocument(key);
    }
    catch (e) {
        const status = e.status;
        if (status === 404)
            return null;
        throw e;
    }
}
async function deleteJsonDocument(key) {
    const db = requirePrisma();
    await ensureTable();
    await db.siteDocument.deleteMany({ where: { key } });
}
//# sourceMappingURL=siteDocumentStore.js.map