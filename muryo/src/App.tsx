import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { theme } from '@/theme';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { EnvCheck } from '@/components/common/EnvCheck';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import HomePage from '@/pages/HomePage';
import DetailPage from '@/pages/DetailPage';

function AppContent() {
  useScrollRestoration();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/giveaway/:id" element={<DetailPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  // 获取 base path，用于 GitHub Pages 部署
  // import.meta.env.BASE_URL 是 Vite 自动注入的，会根据 vite.config.ts 中的 base 配置
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

  // Check environment variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const eventId = import.meta.env.VITE_EVENT_ID;
  
  const hasMissingEnvVars = !supabaseUrl || !supabaseAnonKey || !eventId;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {hasMissingEnvVars ? (
        <EnvCheck />
      ) : (
        <BrowserRouter basename={basename}>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
}

export default App;
