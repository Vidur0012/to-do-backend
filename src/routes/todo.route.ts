import { Router } from "express";
import { addToDo, deleteToDo, getToDos, updateToDo, getReports, toggleToDoStatus } from "../controllers/todo.controller";
import { auth } from "../middlewares/auth";
import { isAdmin } from "../middlewares/isAdmin";

export const toDoRouter = Router();

toDoRouter.get("/", auth, getToDos);
toDoRouter.get("/report", auth, isAdmin, getReports);
toDoRouter.post("/", auth, addToDo);
toDoRouter.put("/:toDoId", auth, updateToDo);
toDoRouter.patch("/:toDoId", auth, toggleToDoStatus);
toDoRouter.delete("/:toDoId", auth, deleteToDo);
