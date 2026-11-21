"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_ROLES = void 0;
exports.isAdminRole = isAdminRole;
exports.ADMIN_ROLES = ['super', 'content', 'inquiry'];
function isAdminRole(value) {
    return value === 'super' || value === 'content' || value === 'inquiry';
}
//# sourceMappingURL=adminAuth.js.map