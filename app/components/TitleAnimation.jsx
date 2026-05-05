import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Small metallic spark particle that falls down
function Spark({ x, y, angle, delay, color, horizontalSpeed, initialUpward, fallDistance, size, duration }) {
  const endX = Math.cos(angle) * horizontalSpeed;

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ 
        x: [0, endX * 0.3, endX * 0.8, endX],
        y: [0, initialUpward, fallDistance * 0.5, fallDistance],
        opacity: [1, 1, 0.8, 0], 
        scale: [1, 1.2, 0.6, 0]
      }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.25, 0.1, 0.25, 1],
        times: [0, 0.1, 0.5, 1]
      }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}`,
        pointerEvents: 'none',
      }}
    />
  );
}

// Generate sparks that spread across the title width and fall
function SparkBurst({ active }) {
  const [sparks, setSparks] = useState([]);

  useEffect(() => {
    if (active) {
      const newSparks = [];
      // Metallic spark colors - hot metal
      const colors = ['#ffffff', '#ffffcc', '#ffdd44', '#ffaa00', '#ff7700', '#ff5500'];
      
      // Title width approximately 450px, so spread sparks across that range
      const titleWidth = 450;
      
      // Create many particles that spread outward and fall
      const sparkCount = 180;
      for (let i = 0; i < sparkCount; i++) {
        // Spawn sparks across the entire title width
        const spawnX = (Math.random() - 0.5) * titleWidth;
        // Angle mostly downward with horizontal spread
        const angle = (Math.random() - 0.5) * Math.PI * 0.6;
        
        newSparks.push({
          id: i,
          x: spawnX,
          y: (Math.random() - 0.5) * 20,
          angle,
          delay: Math.random() * 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          // Pre-calculate random values
          horizontalSpeed: 50 + Math.random() * 150,
          initialUpward: -(20 + Math.random() * 60),
          fallDistance: 500 + Math.random() * 500,
          size: 2 + Math.random() * 4,
          duration: 1.5 + Math.random() * 1.2,
        });
      }
      
      setSparks(newSparks);
    }
  }, [active]);

  if (!active) return null;

  return (
    <>
      {sparks.map((spark) => (
        <Spark key={spark.id} {...spark} />
      ))}
    </>
  );
}





export default function TitleAnimation({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [showSparks, setShowSparks] = useState(false);
  const onCompleteRef = React.useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Phase 0: Initial state
    // Phase 1: Images start moving toward center
    const phase1Timer = setTimeout(() => setPhase(1), 300);
    
    // Phase 2: Collision - trigger sparks
    const phase2Timer = setTimeout(() => {
      setPhase(2);
      setShowSparks(true);
    }, 1100);

    // Phase 3: Images shake and settle
    const phase3Timer = setTimeout(() => setPhase(3), 1300);

    // Phase 4: Fade to combined title
    const phase4Timer = setTimeout(() => setPhase(4), 1800);

    // Complete
    const completeTimer = setTimeout(() => {
      onCompleteRef.current?.();
    }, 2800);

    return () => {
      clearTimeout(phase1Timer);
      clearTimeout(phase2Timer);
      clearTimeout(phase3Timer);
      clearTimeout(phase4Timer);
      clearTimeout(completeTimer);
    };
  }, []);

  const styles = {
    container: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,8,0.95)',
      overflow: 'visible',
    },
    imagesWrapper: {
      position: 'relative',
      width: '100%',
      height: '300px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible',
    },
    babelImage: {
      maxWidth: '90%',
      width: '450px',
      height: 'auto',
    },
    lexiconImage: {
      maxWidth: '90%',
      width: '400px',
      height: 'auto',
    },
    combinedTitle: {
      maxWidth: '90%',
      width: '600px',
      height: 'auto',
    },
  };

  // Animation variants for BABEL (from left)
  const babelVariants = {
    initial: { x: '-100vw', opacity: 0.8 },
    moving: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    collision: {
      x: 10,
      transition: { duration: 0.05 }
    },
    settle: {
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    fadeOut: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  // Animation variants for "The Lexicon War" (from right)
  const lexiconVariants = {
    initial: { x: '100vw', opacity: 0.8 },
    moving: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    collision: {
      x: -10,
      transition: { duration: 0.05 }
    },
    settle: {
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    fadeOut: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  const getBabelState = () => {
    if (phase === 0) return 'initial';
    if (phase === 1) return 'moving';
    if (phase === 2) return 'collision';
    if (phase === 3) return 'settle';
    return 'fadeOut';
  };

  const getLexiconState = () => {
    if (phase === 0) return 'initial';
    if (phase === 1) return 'moving';
    if (phase === 2) return 'collision';
    if (phase === 3) return 'settle';
    return 'fadeOut';
  };

  return (
    <div style={styles.container}>
      <div style={styles.imagesWrapper}>
        {/* Separate images that collide */}
        {phase < 4 && (
          <>
            <motion.img
              src="/images/babel.png"
              alt="BABEL"
              style={styles.babelImage}
              variants={babelVariants}
              initial="initial"
              animate={getBabelState()}
            />
            {/* Spark effects - positioned at center between the two titles */}
            <div style={{ 
              position: 'absolute', 
              left: '50%', 
              top: '50%', 
              transform: 'translate(-50%, -50%)',
              width: 0,
              height: 0,
              zIndex: 10
            }}>
              <SparkBurst active={showSparks} />
            </div>
            <motion.img
              src="/images/the-lexicon-war.png"
              alt="The Lexicon War"
              style={{ ...styles.lexiconImage, marginTop: '-10px' }}
              variants={lexiconVariants}
              initial="initial"
              animate={getLexiconState()}
            />
          </>
        )}

        {/* Combined title that fades in after collision */}
        {phase >= 4 && (
          <motion.img
            src="/images/babel-title.png"
            alt="BABEL: The Lexicon War"
            style={styles.combinedTitle}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </div>


    </div>
  );
}
