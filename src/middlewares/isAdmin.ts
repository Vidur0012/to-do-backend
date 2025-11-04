import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const role = req.user.role.name;
  if (!role || role !== "admin" ) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};