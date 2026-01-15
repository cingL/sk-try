import { Container } from '@mui/material';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <Container 
        maxWidth="md" 
        disableGutters={false}
        sx={{ 
          py: { xs: 1, sm: 2 },
          px: { xs: 1.5, sm: 2 },
          width: '100%',
        }}
      >
        {children}
      </Container>
    </>
  );
}
