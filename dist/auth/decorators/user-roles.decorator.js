"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireUserRoles = exports.USER_ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.USER_ROLES_KEY = 'userRoles';
const RequireUserRoles = (...userRoles) => (0, common_1.SetMetadata)(exports.USER_ROLES_KEY, userRoles);
exports.RequireUserRoles = RequireUserRoles;
//# sourceMappingURL=user-roles.decorator.js.map