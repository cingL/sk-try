import { Box, Typography, Card, CardContent, Chip, Stack } from '@mui/material';
import { ExternalLinkButton } from '@/components/common/ExternalLinkButton';
import type { GiveawayWithProvider } from '@/types';

interface GiveawayDetailProps {
  giveaway: GiveawayWithProvider;
}

const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  available: 'success',
  limited: 'warning',
  ended: 'default',
};

const statusLabels: Record<string, string> = {
  available: '可领取',
  limited: '数量有限',
  ended: '已结束',
};

export function GiveawayDetail({ giveaway }: GiveawayDetailProps) {
  return (
    <Box>
      {/* Image Gallery */}
      {giveaway.images && giveaway.images.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box
            component="img"
            src={giveaway.images[0]}
            alt={giveaway.title}
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: { xs: '50vh', sm: '60vh' },
              objectFit: 'contain',
              backgroundColor: 'grey.100',
              borderRadius: 2,
            }}
          />
          {giveaway.images.length > 1 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              共 {giveaway.images.length} 张图片
            </Typography>
          )}
        </Box>
      )}

      {/* Title and Status */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, flex: 1 }}>
          {giveaway.title}
        </Typography>
        <Chip
          label={statusLabels[giveaway.status] || giveaway.status}
          color={statusColors[giveaway.status] || 'default'}
          sx={{ ml: 2 }}
        />
      </Box>

      {/* Description */}
      {giveaway.description && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
            详情
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
            {giveaway.description}
          </Typography>
        </Box>
      )}

      {/* Pickup Condition */}
      {giveaway.pickup_condition && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
            领取条件
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
            {giveaway.pickup_condition}
          </Typography>
        </Box>
      )}

      {/* Provider Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            摊位信息
          </Typography>
          <Stack spacing={1.5}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                摊位名称
              </Typography>
              <Typography variant="body1">{giveaway.provider.name}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                摊位位置
              </Typography>
              <Typography variant="body1">
                {giveaway.provider.booth_area}-{giveaway.provider.booth_number}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* External Links */}
      {giveaway.provider.external_links && giveaway.provider.external_links.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            联系方式
          </Typography>
          <Stack spacing={1.5}>
            {giveaway.provider.external_links.map((link, index) => (
              <ExternalLinkButton key={index} link={link} fullWidth />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
