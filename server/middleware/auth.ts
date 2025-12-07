import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./AuthRequest";

dotenv.config();

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Invalid token" });
    }

    const decoded = jwt.verify(token, process.env.SECRETKEY as string);

    req.user = decoded;  // ✔ NOW WORKS

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Invalid or expired token" });
  }
};

export default authMiddleware;
