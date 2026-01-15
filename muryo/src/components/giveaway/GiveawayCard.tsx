import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { GiveawayWithProvider } from '@/types';

interface GiveawayCardProps {
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

export function GiveawayCard({ giveaway }: GiveawayCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/giveaway/${giveaway.id}`);
  };

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: '100%',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={handleClick}
    >
      {giveaway.images && giveaway.images.length > 0 && (
        <CardMedia
          component="img"
          image={giveaway.images[0]}
          alt={giveaway.title}
          sx={{ 
            objectFit: 'cover',
            width: '100%',
            height: { xs: 180, sm: 200 },
          }}
          loading="lazy"
        />
      )}
      <CardContent sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          mb: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              flex: 1, 
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              lineHeight: { xs: 1.4, sm: 1.5 }
            }}
          >
            {giveaway.title}
          </Typography>
          <Chip
            label={statusLabels[giveaway.status] || giveaway.status}
            color={statusColors[giveaway.status] || 'default'}
            size="small"
            sx={{ ml: { xs: 0, sm: 1 }, alignSelf: { xs: 'flex-start', sm: 'auto' } }}
          />
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 1,
            fontSize: { xs: '0.875rem', sm: '0.875rem' }
          }}
        >
          {giveaway.provider.name}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
        >
          摊位: {giveaway.provider.booth_area}-{giveaway.provider.booth_number}
        </Typography>
      </CardContent>
    </Card>
  );
}
