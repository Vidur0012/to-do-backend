// roleCache.ts
import { RoleModel } from "../models/role.model";

let defaultUserRoleId: string | null = null;

export const getDefaultUserRoleId = async () => {
    if (!defaultUserRoleId) {
        const userRole = await RoleModel.findOne({ name: "user" });
        if (!userRole) throw new Error("Role 'user' not found in DB");
        defaultUserRoleId = userRole._id!.toString();
    }
    return defaultUserRoleId;
};
