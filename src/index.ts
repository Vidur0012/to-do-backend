import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import { errorHandler } from './middlewares/errorHandler';
import { toDoRouter } from './routes/todo.route';
import { userRouter } from './routes/user.route';
import { seedRoles } from './utils/roleSeeder';

dotenv.config();

//environmental variable
const port = Number(process.env.PORT);
const mongodbUri = process.env.MONGODB_URL!;

const app = express();
app.use(express.json());
app.use(cors());
app.use("/todo", toDoRouter);
app.use("/user", userRouter);

app.use(errorHandler);

(async () => {
    try {
        await mongoose.connect(mongodbUri);
        console.log("Database connected...");
        await seedRoles();
        app.listen(port, () => {
            console.log("Server started on port:", port);
        });
    }
    catch (err) {
        console.error(err);
    }
})();