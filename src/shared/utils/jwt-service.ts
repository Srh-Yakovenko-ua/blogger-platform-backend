import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { envConfig } from './env-config';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
dotenv.config();
const TOKEN_SECRET = process.env.SECRET_TOKEN as any;

const TOKEN_AC_TIME = process.env.AC_TIME as any;
const REFRESH_SECRET = envConfig.refreshSecret as any;
const REFRESH_AC_TIME = envConfig.refreshExpiredTime as any;
export const jwtService = {
  async verifyToken(token: string) {
    try {
      return jwt.verify(token, TOKEN_SECRET!);
    } catch (err) {
      return null;
    }
  },
  async createToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, TOKEN_SECRET, {
      expiresIn: TOKEN_AC_TIME,
    });
  },
  async createRefreshToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, REFRESH_SECRET, {
      expiresIn: REFRESH_AC_TIME,
    });
  },
  async verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, REFRESH_SECRET!);
    } catch (e) {
      return null;
    }
  },
};
