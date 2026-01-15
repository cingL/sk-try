import { Box, Typography, Alert, Stack } from '@mui/material';
import { GiveawayCard } from './GiveawayCard';
import { EmptyState } from '@/components/common/EmptyState';
import { GiveawayListSkeleton } from '@/components/common/LoadingSkeleton';
import type { GiveawayWithProvider } from '@/types';

interface GiveawayListProps {
  giveaways: GiveawayWithProvider[];
  loading?: boolean;
  error?: Error | null;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

export function GiveawayList({ 
  giveaways, 
  loading, 
  error,
  hasActiveFilters = false,
  onClearFilters
}: GiveawayListProps) {
  if (loading) {
    return (
      <Stack spacing={2}>
        <GiveawayListSkeleton count={3} />
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        加载失败: {error.message}
      </Alert>
    );
  }

  if (giveaways.length === 0) {
    if (hasActiveFilters) {
      return <EmptyState onClearFilters={onClearFilters} />;
    }
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          暂无无料信息
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {giveaways.map((giveaway) => (
        <GiveawayCard key={giveaway.id} giveaway={giveaway} />
      ))}
    </Stack>
  );
}
