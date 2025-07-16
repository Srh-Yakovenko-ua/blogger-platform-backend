import bcrypt from 'bcrypt';

const DEFAULT_SALT_ROUNDS = 10;
export const bcryptService = {
  async generateHash(password: string, salt: string) {
    return await bcrypt.hash(password.toString(), salt);
  },
  async compareHash(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  },
  async createSalt() {
    return await bcrypt.genSalt(DEFAULT_SALT_ROUNDS);
  },
};
