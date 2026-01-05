import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, shadows } from '../shared/styles/theme';
import { springTransition, buttonVariants } from '../shared/styles/animations';

const games = [
  {
    id: 'pixel-piano',
    title: 'Pixel Piano',
    description: 'Fill pixel art with colors to create music',
    icon: '🎹',
    gradient: `linear-gradient(135deg, ${colors.neon.coral}, ${colors.neon.orange})`,
    path: '/pixel-piano',
  },
  {
    id: 'coloring-3d',
    title: '3D Coloring',
    description: 'Color 3D objects by tapping numbered regions',
    icon: '🎨',
    gradient: `linear-gradient(135deg, ${colors.neon.mint}, ${colors.neon.azure})`,
    path: '/coloring-3d',
  },
  {
    id: 'conveyor-sort',
    title: 'Block Sort',
    description: 'Sort colored blocks on a conveyor belt puzzle',
    icon: '🧩',
    gradient: `linear-gradient(135deg, ${colors.neon.orange}, ${colors.neon.coral})`,
    path: '/conveyor-sort',
  },
];

const GameCard = ({ game, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, ...springTransition }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(game.path)}
      style={{
        width: '100%',
        maxWidth: 300,
        padding: 24,
        borderRadius: 16,
        background: colors.glass.medium,
        border: `1px solid ${colors.glass.border}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* Icon */}
      <motion.div
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: game.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          boxShadow: shadows.glow.md(colors.neon.azure),
        }}
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {game.icon}
      </motion.div>

      {/* Title */}
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: colors.primary[100],
          margin: 0,
        }}
      >
        {game.title}
      </h2>

      {/* Description */}
      <p
        style={{
          fontSize: '0.75rem',
          color: colors.primary[400],
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {game.description}
      </p>

      {/* Play Button */}
      <motion.button
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        style={{
          marginTop: 8,
          padding: '10px 24px',
          borderRadius: 8,
          border: 'none',
          background: game.gradient,
          color: '#fff',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: shadows.glow.sm(colors.neon.azure),
        }}
      >
        Play
      </motion.button>
    </motion.div>
  );
};

export const HomePage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${colors.primary[900]} 0%, ${colors.primary[800]} 50%, ${colors.primary[900]} 100%)`,
        padding: 24,
        color: '#fff',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          marginBottom: 40,
          marginTop: 40,
        }}
      >
        <motion.h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            marginBottom: 8,
            background: `linear-gradient(135deg, ${colors.neon.coral}, ${colors.neon.orange}, ${colors.neon.yellow}, ${colors.neon.mint})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          Pixel Games
        </motion.h1>
        <p
          style={{
            fontSize: '1rem',
            color: colors.primary[400],
          }}
        >
          Choose a game to play
        </p>
      </motion.div>

      {/* Game Cards */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 24,
          justifyContent: 'center',
          maxWidth: 700,
        }}
      >
        {games.map((game, index) => (
          <GameCard key={game.id} game={game} index={index} />
        ))}
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: 'auto',
          paddingTop: 40,
          fontSize: '0.75rem',
          color: colors.primary[600],
        }}
      >
        Built with React + Framer Motion
      </motion.p>
    </div>
  );
};

export default HomePage;
