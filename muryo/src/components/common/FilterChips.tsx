import { Box, Chip, Typography } from '@mui/material';
import type { GiveawayCategory } from '@/types';

interface FilterChipsProps {
  selectedCategories: GiveawayCategory[];
  onCategoryChange: (categories: GiveawayCategory[]) => void;
  selectedAreas: string[];
  onAreaChange: (areas: string[]) => void;
  availableAreas: string[];
}

const categoryLabels: Record<GiveawayCategory, string> = {
  goods: '实物',
  print: '印刷品',
  digital: '数字',
  other: '其他',
};

const categoryColors: Record<GiveawayCategory, 'default' | 'primary' | 'secondary'> = {
  goods: 'primary',
  print: 'secondary',
  digital: 'default',
  other: 'default',
};

export function FilterChips({
  selectedCategories,
  onCategoryChange,
  selectedAreas,
  onAreaChange,
  availableAreas,
}: FilterChipsProps) {
  const handleCategoryToggle = (category: GiveawayCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleAreaToggle = (area: string) => {
    if (selectedAreas.includes(area)) {
      onAreaChange(selectedAreas.filter((a) => a !== area));
    } else {
      onAreaChange([...selectedAreas, area]);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* Category filters */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
          类型
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {(Object.keys(categoryLabels) as GiveawayCategory[]).map((category) => (
            <Chip
              key={category}
              label={categoryLabels[category]}
              onClick={() => handleCategoryToggle(category)}
              color={selectedCategories.includes(category) ? categoryColors[category] : 'default'}
              variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
        </Box>
      </Box>

      {/* Area filters */}
      {availableAreas.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            区域
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {availableAreas.map((area) => (
              <Chip
                key={area}
                label={area}
                onClick={() => handleAreaToggle(area)}
                color={selectedAreas.includes(area) ? 'primary' : 'default'}
                variant={selectedAreas.includes(area) ? 'filled' : 'outlined'}
                size="small"
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
