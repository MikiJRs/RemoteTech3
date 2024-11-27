import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  email: string;
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token; // Cookie'den token'ı okuma
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};


export default adminMiddleware;
