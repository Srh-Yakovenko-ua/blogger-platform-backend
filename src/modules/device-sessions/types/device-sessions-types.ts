export type DeviceSessionDBType = {
  userId: string;
  ip: string;
  agent: string; // user-agent
  lastActiveDate: string; // ISO
  deviceId: string;
  expiresDate: string; // ISO, когда refresh token протухнет
};
