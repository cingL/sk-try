import { Box, Alert, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export function EnvCheck() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const eventId = import.meta.env.VITE_EVENT_ID;

  const missingVars: string[] = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  if (!eventId) missingVars.push('VITE_EVENT_ID');

  if (missingVars.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        backgroundColor: 'background.default',
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Configuration Error
      </Typography>
      <Alert severity="error" sx={{ mt: 2, maxWidth: 600 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Missing required environment variables:
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 0 }}>
          {missingVars.map((varName) => (
            <li key={varName}>
              <Typography component="code" variant="body2">
                {varName}
              </Typography>
            </li>
          ))}
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Please configure these in GitHub Secrets (Settings → Secrets and variables → Actions).
        </Typography>
      </Alert>
    </Box>
  );
}
