"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.draftDocumentKey = draftDocumentKey;
exports.saveModeOf = saveModeOf;
exports.isAdminPath = isAdminPath;
exports.adminCanSeeDraft = adminCanSeeDraft;
exports.readDrafted = readDrafted;
exports.writeDrafted = writeDrafted;
const requireAdmin_1 = require("../middlewares/requireAdmin");
const siteDocumentStore_1 = require("./siteDocumentStore");
function draftDocumentKey(key) {
    return `${key}__draft`;
}
function saveModeOf(req) {
    return req.query.mode === 'draft' ? 'draft' : 'publish';
}
function isAdminPath(req) {
    return req.path.startsWith('/admin/');
}
/** 공개 주소라도 관리자 세션이면 임시저장을 보여 준다. 세션이 없으면 게시본만 본다. */
async function adminCanSeeDraft(req) {
    return Boolean(await (0, requireAdmin_1.loadAdminUser)(req));
}
async function readDrafted(key, readPublished, preferDraft) {
    if (preferDraft) {
        const draft = await (0, siteDocumentStore_1.readJsonDocumentOptional)(draftDocumentKey(key));
        if (draft != null)
            return { doc: draft, unpublished: true };
    }
    return { doc: await readPublished(), unpublished: false };
}
async function writeDrafted(key, cleaned, mode, afterPublish) {
    if (mode === 'draft') {
        await (0, siteDocumentStore_1.writeJsonDocument)(draftDocumentKey(key), cleaned);
        return;
    }
    const previous = afterPublish ? await (0, siteDocumentStore_1.readJsonDocumentOptional)(key) : null;
    await (0, siteDocumentStore_1.writeJsonDocument)(key, cleaned);
    await (0, siteDocumentStore_1.deleteJsonDocument)(draftDocumentKey(key));
    if (afterPublish)
        await afterPublish(previous);
}
//# sourceMappingURL=documentDraft.js.map