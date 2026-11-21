"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kayaPagesRouter = void 0;
const express_1 = require("express");
const kayaPagesController_1 = require("../controllers/kayaPagesController");
exports.kayaPagesRouter = (0, express_1.Router)();
exports.kayaPagesRouter.get('/kaya-pages', kayaPagesController_1.getKayaPages);
exports.kayaPagesRouter.get('/admin/kaya-pages', kayaPagesController_1.getKayaPages);
exports.kayaPagesRouter.put('/admin/kaya-pages', kayaPagesController_1.putAdminKayaPages);
//# sourceMappingURL=kayaPages.js.map