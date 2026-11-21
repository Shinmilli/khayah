"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaintenance = getMaintenance;
exports.getAdminMaintenance = getAdminMaintenance;
exports.putAdminMaintenance = putAdminMaintenance;
const maintenanceFileService_1 = require("../services/maintenanceFileService");
async function getMaintenance(_req, res) {
    try {
        const doc = await (0, maintenanceFileService_1.readMaintenanceDocument)();
        res.setHeader('Cache-Control', 'no-store');
        res.json(doc);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: '점검 상태를 불러오지 못했습니다.' });
    }
}
async function getAdminMaintenance(_req, res) {
    try {
        const doc = await (0, maintenanceFileService_1.readMaintenanceDocument)();
        res.setHeader('Cache-Control', 'no-store');
        res.json(doc);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: '점검 설정을 불러오지 못했습니다.' });
    }
}
async function putAdminMaintenance(req, res) {
    try {
        await (0, maintenanceFileService_1.writeMaintenanceDocument)(req.body);
        const doc = await (0, maintenanceFileService_1.readMaintenanceDocument)();
        res.json(doc);
    }
    catch (e) {
        const status = e?.status;
        if (status === 400) {
            res.status(400).json({ error: '점검 안내 내용이 올바르지 않습니다.' });
            return;
        }
        if (status === 503) {
            res.status(503).json({ error: '데이터베이스에 연결할 수 없습니다.' });
            return;
        }
        console.error(e);
        res.status(500).json({ error: '점검 설정을 저장하지 못했습니다.' });
    }
}
//# sourceMappingURL=maintenanceController.js.map