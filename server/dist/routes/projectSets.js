"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectSetsRouter = void 0;
const express_1 = require("express");
const projectSetsController_1 = require("../controllers/projectSetsController");
exports.projectSetsRouter = (0, express_1.Router)();
exports.projectSetsRouter.get('/project-sets', projectSetsController_1.getProjectSets);
exports.projectSetsRouter.get('/admin/project-sets', projectSetsController_1.getProjectSets);
exports.projectSetsRouter.put('/admin/project-sets', projectSetsController_1.putAdminProjectSets);
//# sourceMappingURL=projectSets.js.map