import { Button, Box, Typography } from '@mui/material';
import { useExternalLink } from '@/hooks/useExternalLink';
import type { ExternalLink, LinkPlatform } from '@/types';

interface ExternalLinkButtonProps {
  link: ExternalLink;
  fullWidth?: boolean;
}

const platformIcons: Record<LinkPlatform, string> = {
  rednote: '📕',
  weibo: '📱',
  website: '🌐',
  other: '🔗',
};

const platformLabels: Record<LinkPlatform, string> = {
  rednote: '小红书',
  weibo: '微博',
  website: '网站',
  other: '链接',
};

export function ExternalLinkButton({ link, fullWidth = false }: ExternalLinkButtonProps) {
  const { openLink } = useExternalLink();

  const handleClick = () => {
    openLink(link);
  };

  const icon = platformIcons[link.platform] || platformIcons.other;
  const label = link.username 
    ? `${platformLabels[link.platform]}: ${link.username}`
    : platformLabels[link.platform];

  return (
    <Button
      variant="outlined"
      onClick={handleClick}
      fullWidth={fullWidth}
      sx={{
        justifyContent: 'flex-start',
        textTransform: 'none',
        py: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography component="span" sx={{ fontSize: '1.2rem' }}>
          {icon}
        </Typography>
        <Typography variant="body1">{label}</Typography>
      </Box>
    </Button>
  );
}
