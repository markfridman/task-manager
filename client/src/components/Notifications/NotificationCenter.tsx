import React from 'react';
import { useRecoilState } from 'recoil';
import { Snackbar, Alert, Stack } from '@mui/material';
import { notificationsState } from '../../recoil/notificationState';

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useRecoilState(notificationsState);

  const handleClose = (id: string) => {
    setNotifications(current => current.filter(notification => notification.id !== id));
  };

  return (
    <Stack 
      spacing={1} 
      sx={{ 
        position: 'fixed', 
        top: 24, 
        right: window.innerWidth - 50, 
        zIndex: 2000 
      }}
    >
      {notifications.map(notification => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration || 6000}
          onClose={() => handleClose(notification.id)}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
};