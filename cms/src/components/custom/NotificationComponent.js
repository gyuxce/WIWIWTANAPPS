import { Notification, toast } from "components/ui";
import React from 'react';

export const openNotification = (title, type, value) => {
  toast.push(
      <Notification title={title} type={type}>
        {value}
      </Notification>,
    );
  };