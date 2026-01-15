import { Box, CircularProgress, Alert, IconButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGiveaway } from '@/hooks/useGiveaway';
import { GiveawayDetail } from '@/components/giveaway/GiveawayDetail';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { giveaway, loading, error } = useGiveaway(id || '');

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <IconButton onClick={handleBack} sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Alert severity="error">
          加载失败: {error.message}
        </Alert>
      </Box>
    );
  }

  if (!giveaway) {
    return (
      <Box>
        <IconButton onClick={handleBack} sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Alert severity="info">
          未找到该无料信息
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <IconButton onClick={handleBack} sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>
      <GiveawayDetail giveaway={giveaway} />
    </Box>
  );
}
