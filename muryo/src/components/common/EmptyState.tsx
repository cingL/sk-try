import { Box, Typography, Button } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

interface EmptyStateProps {
  onClearFilters?: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 2,
      }}
    >
      <SearchOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        未找到匹配的无料信息
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        请尝试调整搜索条件或筛选器
      </Typography>
      {onClearFilters && (
        <Button variant="outlined" onClick={onClearFilters}>
          清除筛选条件
        </Button>
      )}
    </Box>
  );
}
