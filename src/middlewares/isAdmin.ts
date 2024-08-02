// src/middlewares/isAdmin.ts
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface TokenPayload {
  sub: string;
  role: string;
}

export function isAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Token not provided' });
    return;
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string);
    const { role } = decoded as TokenPayload;

    if (role !== 'ADMIN') {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
