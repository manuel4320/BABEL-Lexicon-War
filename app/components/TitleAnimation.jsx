import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Small metallic spark particle
function Spark({ x, y, angle, delay, color }) {
  const distance = 80 + Math.random() * 150;
  const gravity = 60 + Math.random() * 80;
  const endX = Math.cos(angle) * distance;
  const endY = Math.sin(angle) * distance + gravity;
  const size = 4 + Math.random() * 5;
  const duration = 0.6 + Math.random() * 0.6;

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1.2 }}
      animate={{ 
        x: endX, 
        y: endY, 
        opacity: [1, 1, 0], 
        scale: [1.2, 0.8, 0]
      }}
      transition={{ duration, delay, ease: "easeOut", times: [0, 0.5, 1] }}
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

// Generate small sparks at collision point
function SparkBurst({ active }) {
  const [sparks, setSparks] = useState([]);

  useEffect(() => {
    if (active) {
      const newSparks = [];
      // Metallic spark colors
      const colors = ['#ffffff', '#ffffcc', '#ffcc44', '#ff9900', '#ff6600'];
      
      // Create many small particles - spawn from center with small offset
      const sparkCount = 80;
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 1.2;
        newSparks.push({
          id: i,
          x: (Math.random() - 0.5) * 50,
          y: (Math.random() - 0.5) * 30,
          angle,
          delay: Math.random() * 0.15,
          color: colors[Math.floor(Math.random() * colors.length)],
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
      overflow: 'hidden',
    },
    imagesWrapper: {
      position: 'relative',
      width: '100%',
      height: '300px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
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
            {/* Spark effects - positioned between the two titles */}
            <div style={{ position: 'relative', width: '100%', height: 0, display: 'flex', justifyContent: 'center' }}>
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
