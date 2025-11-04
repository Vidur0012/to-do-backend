import { Request, Response, NextFunction } from 'express';
import { ToDoModel } from '../models/todo.model';
import {UserModel } from '../models/user.model';

export const addToDo = async (req: Request, res: Response, next: NextFunction) => {
  const { title, category, priority, dueDate } = req.body;
  await ToDoModel.create({ title, category, priority, dueDate, user: req.user!._id });
  res.status(201).json({ message: 'ToDo added' });
};

export const updateToDo = async (req: Request, res: Response, next: NextFunction) => {
  const { toDoId } = req.params;
  const roleName = req.user?.role?.name;
  const filter = roleName === "admin" ? {} : { user: req.user!._id };
  const { title, category, status, priority, dueDate } = req.body;
  await ToDoModel.findOneAndUpdate({ _id: toDoId, ...filter }, { title, category, status, priority, dueDate });
  res.json({ message: 'ToDo updated' });
};

export const getToDos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleName = req.user?.role?.name;
    const isCompletedQuery = req.query.completed === "true";
    // role filter
    const baseFilter: any = roleName === "admin" ? {} : { user: req.user!._id };

    // get today's date (start of day: 00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filter: any = { ...baseFilter };

    if (isCompletedQuery) {
      // completed AND dueDate < today
      filter = {
        ...baseFilter,
        status: true,               // completed
        completedAt: { $lt: today }     // before today
      };
    } else {
      // not completed OR completed today
      filter = {
        ...baseFilter,
        $or: [
          { status: false },                                              // not done
          { status: true, completedAt: { $gte: today } }                      // completed today
        ]
      };
    }

    const toDos = await ToDoModel.find(filter);
    res.json(toDos);
  } catch (error) {
    next(error);
  }
};

export const toggleToDoStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { toDoId } = req.params;
  const { status } = req.body;
  const roleName = req.user?.role?.name;
  const filter = roleName === "admin" ? {} : { user: req.user!._id };

  const todo = await ToDoModel.findOneAndUpdate({ _id: toDoId, ...filter }, { status: !status, completedAt: status ? null : new Date() }, { new: true });
  res.json(todo);
};

export const getReports = async (req: Request, res: Response) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalTodos = await ToDoModel.countDocuments({ deletedAt: null });

    const today = new Date();
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 6); // includes today

    const prevWeekStart = new Date(today);
    prevWeekStart.setDate(today.getDate() - 13); // 14 days before today
    const prevWeekEnd = new Date(today);
    prevWeekEnd.setDate(today.getDate() - 7); // 7 days before today

    // 3. Avg todos per user (last 7 days)
    const tasksLast7Days = await ToDoModel.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days, $lte: today },
          deletedAt: null
        }
      },
      {
        $group: {
          _id: "$user",
          taskCount: { $sum: 1 }
        }
      }
    ]);

    const avgTasksPerUser =
      tasksLast7Days.length > 0
        ? tasksLast7Days.reduce((sum, obj) => sum + obj.taskCount, 0) /
        tasksLast7Days.length
        : 0;

    // Task distribution based on status (for pie chart)
    const taskStatusDistribution = await ToDoModel.aggregate([
      {
        $match: { deletedAt: null }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Last 7 days vs previous 7 days
    const taskComparison = await ToDoModel.aggregate([
      {
        $facet: {
          last7Days: [
            {
              $match: {
                createdAt: { $gte: last7Days, $lte: today },
                deletedAt: null
              }
            },
            { $count: "count" }
          ],
          prev7Days: [
            {
              $match: {
                createdAt: { $gte: prevWeekStart, $lte: prevWeekEnd },
                deletedAt: null
              }
            },
            { $count: "count" }
          ]
        }
      }
    ]);

    return res.status(200).json({
      totalUsers,
      totalTodos,
      avgTasksPerUser: avgTasksPerUser.toFixed(2),
      taskStatusDistribution,
      tasksAdded: {
        last7Days:
          taskComparison[0]?.last7Days[0]?.count || 0,
        previous7Days:
          taskComparison[0]?.prev7Days[0]?.count || 0
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error generating report", error });
  }
};

export const deleteToDo = async (req: Request, res: Response, next: NextFunction) => {
  const { toDoId } = req.params;
  const roleName = req.user?.role?.name;
  const filter = roleName === "admin" ? {} : { user: req.user!._id };
  await ToDoModel.findOneAndDelete({ _id: toDoId, ...filter });
  res.json({ message: 'ToDo deleted' });
};
