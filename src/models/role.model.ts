import mongoose, { Schema, Document } from 'mongoose';
import { ROLES } from '../utils/constants';

export interface IRole extends Document {
    name: typeof ROLES[number];
    description: string;
}

const roleSchema = new Schema<IRole>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            enum: ROLES
        },
        description: {
            type: String,
            required: false
        },
    },
    { timestamps: true }
);

export const RoleModel = mongoose.model<IRole>('Role', roleSchema);
