import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Metal spark particle component with trail effect
function MetalSpark({ x, y, angle, delay, color, type }) {
  const speed = 150 + Math.random() * 200;
  const gravity = 300 + Math.random() * 200;
  const duration = 0.5 + Math.random() * 0.6;
  const size = type === 'large' ? 4 + Math.random() * 3 : 1.5 + Math.random() * 2;
  const rotation = Math.random() * 360;
  
  // Calculate trajectory with gravity
  const endX = x + Math.cos(angle) * speed;
  const endY = y + Math.sin(angle) * speed + gravity;

  return (
    <motion.div
      initial={{ 
        x, 
        y, 
        opacity: 1, 
        scale: 1,
        rotate: 0
      }}
      animate={{ 
        x: [x, x + Math.cos(angle) * speed * 0.5, endX],
        y: [y, y + Math.sin(angle) * speed * 0.3, endY],
        opacity: [1, 1, 0],
        scale: [1, 0.8, 0],
        rotate: rotation
      }}
      transition={{ 
        duration, 
        delay,
        ease: "easeOut",
        times: [0, 0.3, 1]
      }}
      style={{
        position: 'absolute',
        width: type === 'streak' ? size * 4 : size,
        height: size,
        borderRadius: type === 'streak' ? '2px' : '50%',
        background: type === 'streak' 
          ? `linear-gradient(90deg, transparent, ${color}, ${color})` 
          : color,
        boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}`,
        pointerEvents: 'none',
        transformOrigin: 'center',
      }}
    />
  );
}

// Hot metal fragment
function MetalFragment({ x, y, angle, delay }) {
  const distance = 60 + Math.random() * 100;
  const gravity = 200 + Math.random() * 150;
  const duration = 0.6 + Math.random() * 0.4;
  const size = 3 + Math.random() * 5;
  const rotation = Math.random() * 720 - 360;

  return (
    <motion.div
      initial={{ 
        x, 
        y, 
        opacity: 1, 
        scale: 1,
        rotate: 0
      }}
      animate={{ 
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance + gravity,
        opacity: [1, 1, 0.8, 0],
        scale: [1, 0.9, 0.7, 0],
        rotate: rotation
      }}
      transition={{ 
        duration, 
        delay,
        ease: "easeOut"
      }}
      style={{
        position: 'absolute',
        width: size,
        height: size * 0.6,
        background: 'linear-gradient(135deg, #fff 0%, #ffdd44 30%, #ff8800 60%, #cc4400 100%)',
        boxShadow: '0 0 8px #ff8800, 0 0 15px #ff6600, 0 0 25px #ff4400',
        clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
        pointerEvents: 'none',
      }}
    />
  );
}

// Generate metal sparks at collision point
function MetalSparkBurst({ active, centerX, centerY }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const newParticles = [];
      
      // Hot metal colors - from white hot to cooling
      const sparkColors = [
        '#ffffff', // white hot
        '#ffffcc', // bright yellow
        '#ffdd44', // golden
        '#ff9922', // orange
        '#ff6600', // deep orange
        '#ff4400', // red-orange
      ];
      
      // Main spark burst - small fast particles
      for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 * i) / 50 + (Math.random() - 0.5) * 0.8;
        newParticles.push({
          id: `spark-${i}`,
          type: 'spark',
          x: centerX + (Math.random() - 0.5) * 20,
          y: centerY + (Math.random() - 0.5) * 20,
          angle,
          delay: Math.random() * 0.05,
          color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
          sparkType: Math.random() > 0.5 ? 'streak' : 'dot',
        });
      }
      
      // Large bright sparks
      for (let i = 0; i < 15; i++) {
        const angle = (Math.PI * 2 * i) / 15 + (Math.random() - 0.5) * 0.5;
        newParticles.push({
          id: `large-${i}`,
          type: 'spark',
          x: centerX + (Math.random() - 0.5) * 10,
          y: centerY + (Math.random() - 0.5) * 10,
          angle,
          delay: Math.random() * 0.03,
          color: sparkColors[Math.floor(Math.random() * 3)], // Hotter colors
          sparkType: 'large',
        });
      }
      
      // Metal fragments
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.6;
        newParticles.push({
          id: `fragment-${i}`,
          type: 'fragment',
          x: centerX + (Math.random() - 0.5) * 15,
          y: centerY + (Math.random() - 0.5) * 15,
          angle,
          delay: Math.random() * 0.02,
        });
      }
      
      setParticles(newParticles);
    }
  }, [active, centerX, centerY]);

  if (!active) return null;

  return (
    <>
      {particles.map((particle) => 
        particle.type === 'fragment' ? (
          <MetalFragment key={particle.id} {...particle} />
        ) : (
          <MetalSpark key={particle.id} {...particle} type={particle.sparkType} />
        )
      )}
    </>
  );
}

// Flash effect on collision
function CollisionFlash({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(0,255,204,0.4) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </AnimatePresence>
  );
}

// Shockwave ring effect
function Shockwave({ active, centerX, centerY }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: 'absolute',
            left: centerX - 50,
            top: centerY - 50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: '2px solid #00ffcc',
            pointerEvents: 'none',
          }}
        />
      )}
    </AnimatePresence>
  );
}

export default function TitleAnimation({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [showSparks, setShowSparks] = useState(false);
  const [screenCenter, setScreenCenter] = useState({ x: 0, y: 0 });
  const onCompleteRef = React.useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setScreenCenter({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 20,
    });
  }, []);

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
      {/* Spark effects */}
      <SparkBurst 
        active={showSparks} 
        centerX={screenCenter.x} 
        centerY={screenCenter.y} 
      />
      
      {/* Collision flash */}
      <CollisionFlash active={phase === 2} />
      
      {/* Shockwave */}
      <Shockwave 
        active={phase === 2} 
        centerX={screenCenter.x} 
        centerY={screenCenter.y} 
      />

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

      {/* Ambient glow during collision */}
      <AnimatePresence>
        {phase >= 2 && phase < 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(0,255,204,0.15) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
