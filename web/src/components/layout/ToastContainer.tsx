'use client';

import { useNotificationStore } from '@/stores/notificationStore';
import { Toast } from '@/components/ui/Toast';

export function ToastContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-md">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          id={notification.id}
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
}
