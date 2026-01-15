import { Alert, AlertTitle } from '@mui/material';
import type { EventStatus } from '@/types';

interface EventStatusBannerProps {
  status: EventStatus;
  eventName?: string;
}

const statusConfig: Record<EventStatus, { severity: 'info' | 'success' | 'warning' | 'error'; title: string; message: string }> = {
  upcoming: {
    severity: 'info',
    title: '活动即将开始',
    message: '活动尚未开始，请稍后再来查看',
  },
  ongoing: {
    severity: 'success',
    title: '活动进行中',
    message: '活动正在进行，欢迎浏览无料信息',
  },
  ended: {
    severity: 'warning',
    title: '活动已结束',
    message: '活动已结束，以下信息仅供参考',
  },
};

export function EventStatusBanner({ status, eventName }: EventStatusBannerProps) {
  const config = statusConfig[status];

  return (
    <Alert severity={config.severity} sx={{ mb: 3 }}>
      <AlertTitle>{config.title}</AlertTitle>
      {eventName && (
        <div>
          <strong>{eventName}</strong>
        </div>
      )}
      {config.message}
    </Alert>
  );
}
