import { Box, Typography, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useGiveaways } from '@/hooks/useGiveaways';
import { useEvent } from '@/hooks/useEvent';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useSearch } from '@/hooks/useSearch';
import { GiveawayList } from '@/components/giveaway/GiveawayList';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterChips } from '@/components/common/FilterChips';
import { EventStatusBanner } from '@/components/common/EventStatusBanner';

export default function HomePage() {
  const { giveaways, loading, error, refresh } = useGiveaways();
  const { event } = useEvent();
  
  const {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    setSelectedCategories,
    selectedAreas,
    setSelectedAreas,
    availableAreas,
    filteredGiveaways,
    clearFilters,
    hasActiveFilters,
  } = useSearch(giveaways);
  
  const { isRefreshing, pullDistance, pullProgress } = usePullToRefresh({
    onRefresh: refresh,
    enabled: !loading
  });

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* 下拉刷新指示器 */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: pullDistance > 0 ? `${Math.min(pullDistance, 80)}px` : 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: pullDistance > 0 ? 'none' : 'height 0.3s ease-out',
          zIndex: 1000,
          pointerEvents: 'none',
          backgroundColor: 'background.default'
        }}
      >
        {pullDistance > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              opacity: Math.min(pullProgress, 1)
            }}
          >
            {isRefreshing ? (
              <CircularProgress size={24} />
            ) : (
              <RefreshIcon
                sx={{
                  transform: `rotate(${pullProgress * 180}deg)`,
                  transition: 'transform 0.2s ease-out',
                  color: pullProgress >= 1 ? 'primary.main' : 'text.secondary'
                }}
              />
            )}
            <Typography variant="caption" color="text.secondary">
              {pullProgress >= 1 ? '松开刷新' : '下拉刷新'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* 内容区域 */}
      <Box sx={{ pt: pullDistance > 0 ? `${Math.min(pullDistance, 80)}px` : 0, width: '100%' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 600, 
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '1.5rem', sm: '2.125rem' }
          }}
        >
          活动无料信息
        </Typography>
        
        {event && <EventStatusBanner status={event.status} eventName={event.name} />}
        
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        
        <FilterChips
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          selectedAreas={selectedAreas}
          onAreaChange={setSelectedAreas}
          availableAreas={availableAreas}
        />
        
        <GiveawayList 
          giveaways={filteredGiveaways} 
          loading={loading} 
          error={error}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      </Box>
    </Box>
  );
}
