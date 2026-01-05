import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { colors } from './shared/styles/theme';

// Pages
import HomePage from './pages/HomePage';

// Lazy load game pages for better performance
const PixelPianoPage = lazy(() => import('./pages/PixelPianoPage'));
const Coloring3DPage = lazy(() => import('./pages/Coloring3DPage'));
const ConveyorSortPage = lazy(() => import('./pages/ConveyorSortPage'));

// Loading fallback
const LoadingFallback = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${colors.primary[900]} 0%, ${colors.primary[800]} 100%)`,
      color: '#fff',
    }}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        fontSize: '1.25rem',
        fontWeight: 600,
        color: colors.primary[300],
      }}
    >
      Loading...
    </motion.div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pixel-piano" element={<PixelPianoPage />} />
        <Route path="/coloring-3d" element={<Coloring3DPage />} />
        <Route path="/conveyor-sort" element={<ConveyorSortPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
