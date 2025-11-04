// seedRoles.ts
import { RoleModel } from '../models/role.model';

export const seedRoles = async () => {
    const roles = ["admin", "user"];
    for (const name of roles) {
        const exists = await RoleModel.findOne({ name });
        if (!exists) {
            await RoleModel.create({ name, description: `${name} role` });
        }
    }
    console.log("Roles seeded successfully");
};
