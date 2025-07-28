import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const SECRET = process.env.SECRET_TOKEN as any;

const AC_TIME = process.env.AC_TIME as any;
export const jwtService = {
  async verifyToken(token: string) {
    return jwt.verify(token, SECRET!);
  },
  async createToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, SECRET, {
      expiresIn: AC_TIME,
    });
  },
};
