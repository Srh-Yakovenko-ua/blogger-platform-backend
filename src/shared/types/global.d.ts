declare global {
  declare namespace Express {
    export interface Request {
      user: { id: string } | undefined;
      deviceId: string | undefined;
    }
  }
}
export {};
