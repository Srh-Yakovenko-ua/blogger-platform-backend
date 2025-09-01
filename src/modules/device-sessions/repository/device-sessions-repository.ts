import { DeviceSessionDBType } from '../types/device-sessions-types';
import { deviceSessionsCollections } from '../../../setup/setup-mongo-db';

export const deviceSessionsRepository = {
  async createSession(session: DeviceSessionDBType) {
    await deviceSessionsCollections.insertOne(session);
  },
};
