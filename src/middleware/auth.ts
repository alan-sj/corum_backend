import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "n3j2n3j2n3j2n3jn2";

export interface AuthRequest extends Request {
  user?: { id: string; username: string };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token missing" });
  }

  const token: string = authHeader.split(" ")[1] ?? "";

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as {
      id: string;
      username: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const checkToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token: string = authHeader.split(" ")[1] ?? "";
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as unknown as {
        id: string;
        username: string;
      };
      req.user = decoded;
    } catch {
      //
    }
  }

  next();
};
