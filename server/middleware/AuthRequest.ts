import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";


export interface AuthRequest extends Request {
  user?: string | JwtPayload; // decoded JWT user info
  id?: string;                // optional id
  email?: string;             // optional email
  name?: string;              // optional name
  role?: string;              // optional role
}


