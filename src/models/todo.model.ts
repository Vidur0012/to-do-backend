import { Schema, model, Document, Types } from "mongoose";


export enum TodoPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export enum TodoCategories {
  HOME = "Home",
  OFFICE = "Office",
  PERSONAL = "Personal",
}

export interface ITodo extends Document {
  user: Types.ObjectId; // Reference to user
  title: string;
  category: string; // Home, Office, Personal
  status: boolean;
  priority: TodoPriority;
  dueDate: Date; // Date/Time when task is due
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date;
}

const todoSchema = new Schema<ITodo>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(TodoCategories),
      default: TodoCategories.PERSONAL,
    },
    status: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: Object.values(TodoPriority),
      default: TodoPriority.MEDIUM,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
      default: null
    },
  },
  {
    timestamps: true, // createdAt & updatedAt auto-added
  }
);


export const ToDoModel = model<ITodo>("Todo", todoSchema);
