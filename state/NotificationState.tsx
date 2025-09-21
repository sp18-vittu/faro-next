import { createWithEqualityFn } from 'zustand/traditional';
import { Notification } from "@/shared/types/types";


interface NotifcationState {
  notification: Array<Notification>;
  setBenefitsNotification: (notification: Array<Notification>) => void;
}

export const useNotificationStore = createWithEqualityFn<NotifcationState>((set) => ({
  notification: [],

  setBenefitsNotification: (notification) =>
    set(() => ({
      notification: JSON.parse(JSON.stringify(notification)),
    })),
}), (a, b)=>{return false});
