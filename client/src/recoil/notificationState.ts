import { atom } from 'recoil';
import { Notification } from '../types/notification';

export const notificationsState = atom<Notification[]>({
  key: 'notificationsState',
  default: [],
});
