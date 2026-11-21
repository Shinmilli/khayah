"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUsersRouter = void 0;
const express_1 = require("express");
const adminUsersController_1 = require("../controllers/adminUsersController");
exports.adminUsersRouter = (0, express_1.Router)();
exports.adminUsersRouter.get('/admin/users', adminUsersController_1.adminListUsers);
exports.adminUsersRouter.post('/admin/users', adminUsersController_1.adminInviteUser);
exports.adminUsersRouter.patch('/admin/users/:id', adminUsersController_1.adminPatchUser);
exports.adminUsersRouter.delete('/admin/users/:id', adminUsersController_1.adminDeleteUser);
//# sourceMappingURL=adminUsers.js.map