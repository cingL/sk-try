import { Box, Skeleton, Card, CardContent } from '@mui/material';

export function GiveawayCardSkeleton() {
  return (
    <Card sx={{ width: '100%', mb: 2 }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Skeleton variant="text" width="70%" height={32} />
          <Skeleton variant="rectangular" width={60} height={24} />
        </Box>
        <Skeleton variant="text" width="50%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={24} />
      </CardContent>
    </Card>
  );
}

export function GiveawayListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <GiveawayCardSkeleton key={index} />
      ))}
    </>
  );
}
