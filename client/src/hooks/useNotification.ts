import { useSetRecoilState } from 'recoil';
import { notificationsState } from '../recoil/notificationState';
import { NotificationType } from '../types/notification';
import { v4 as uuidv4 } from 'uuid';

export const useNotification = () => {
  const setNotifications = useSetRecoilState(notificationsState);

  const showNotification = (
    message: string,
    type: NotificationType = 'info',
    duration: number = 3000
  ) => {
    const id = uuidv4();
    setNotifications(current => [
      ...current,
      { id, message, type, duration }
    ]);
  };

  return {
    showSuccess: (message: string) => showNotification(message, 'success'),
    showError: (message: string) => showNotification(message, 'error'),
    showWarning: (message: string) => showNotification(message, 'warning'),
    showInfo: (message: string) => showNotification(message, 'info'),
  };
};