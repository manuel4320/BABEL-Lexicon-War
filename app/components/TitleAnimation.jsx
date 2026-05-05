import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Metallic spark particle component - elongated for metal grinding effect
function Spark({ x, y, angle, delay, color, isTrail }) {
  const distance = 100 + Math.random() * 180;
  const gravity = 150 + Math.random() * 100; // Sparks fall due to gravity
  const endX = x + Math.cos(angle) * distance;
  const endY = y + Math.sin(angle) * distance + gravity;
  const width = isTrail ? (1 + Math.random() * 2) : (2 + Math.random() * 3);
  const height = isTrail ? (8 + Math.random() * 15) : (3 + Math.random() * 5);
  const duration = 0.5 + Math.random() * 0.6;
  const rotation = (angle * 180) / Math.PI;

  return (
    <motion.div
      initial={{ 
        x, 
        y, 
        opacity: 1, 
        scale: 1,
        rotate: rotation
      }}
      animate={{ 
        x: [x, x + (endX - x) * 0.3, endX], 
        y: [y, y + (endY - y) * 0.2, endY], 
        opacity: [1, 1, 0], 
        scale: [1, 0.8, 0]
      }}
      transition={{ 
        duration, 
        delay, 
        ease: "easeOut",
        times: [0, 0.3, 1]
      }}
      style={{
        position: 'absolute',
        width: width,
        height: height,
        borderRadius: isTrail ? '1px' : '50%',
        background: `linear-gradient(to bottom, ${color}, transparent)`,
        boxShadow: `0 0 ${width * 3}px ${color}, 0 0 ${width * 6}px ${color}`,
        pointerEvents: 'none',
        transformOrigin: 'center center',
      }}
    />
  );
}

// Hot metal fragment that bounces
function MetalFragment({ x, y, angle, delay }) {
  const distance = 60 + Math.random() * 100;
  const endX = x + Math.cos(angle) * distance;
  const endY = y + Math.sin(angle) * distance + 200;
  const size = 3 + Math.random() * 5;
  const duration = 0.8 + Math.random() * 0.4;
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
        x: endX, 
        y: endY, 
        opacity: [1, 1, 0.8, 0], 
        scale: [1, 1.2, 0.6, 0],
        rotate: rotation
      }}
      transition={{ 
        duration, 
        delay, 
        ease: "easeOut",
        times: [0, 0.2, 0.6, 1]
      }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #fff 0%, #ffaa00 30%, #ff6600 60%, #cc3300 100%)',
        boxShadow: '0 0 8px #ff6600, 0 0 16px #ff4400, 0 0 24px #ff220088',
        pointerEvents: 'none',
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      }}
    />
  );
}

// Generate metallic sparks at collision point
function SparkBurst({ active, centerX, centerY }) {
  const [sparks, setSparks] = useState([]);
  const [fragments, setFragments] = useState([]);

  useEffect(() => {
    if (active) {
      const newSparks = [];
      const newFragments = [];
      
      // Metallic spark colors - hot metal palette
      const hotColors = ['#ffffff', '#ffffaa', '#ffcc44', '#ff9900', '#ff6600', '#ff4400'];
      const coolColors = ['#ffaa66', '#ff8844', '#dd6622', '#bb4400'];
      
      // Main burst of sparks - more concentrated horizontally (collision direction)
      const mainSparkCount = 60;
      for (let i = 0; i < mainSparkCount; i++) {
        // Sparks spray more horizontally from impact point
        const baseAngle = (Math.random() > 0.5 ? 0 : Math.PI) + (Math.random() - 0.5) * 1.2;
        const angle = baseAngle + (Math.random() - 0.5) * 0.8;
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 30;
        
        newSparks.push({
          id: `main-${i}`,
          x: centerX + offsetX,
          y: centerY + offsetY,
          angle,
          delay: Math.random() * 0.08,
          color: hotColors[Math.floor(Math.random() * hotColors.length)],
          isTrail: false,
        });
      }
      
      // Trailing sparks - longer, thinner
      const trailCount = 35;
      for (let i = 0; i < trailCount; i++) {
        const baseAngle = (Math.random() > 0.5 ? -0.3 : Math.PI + 0.3);
        const angle = baseAngle + (Math.random() - 0.5) * 0.6;
        
        newSparks.push({
          id: `trail-${i}`,
          x: centerX + (Math.random() - 0.5) * 20,
          y: centerY + (Math.random() - 0.5) * 20,
          angle,
          delay: Math.random() * 0.12,
          color: coolColors[Math.floor(Math.random() * coolColors.length)],
          isTrail: true,
        });
      }
      
      // Hot metal fragments
      const fragmentCount = 12;
      for (let i = 0; i < fragmentCount; i++) {
        const angle = (Math.PI * 2 * i) / fragmentCount + (Math.random() - 0.5) * 0.5;
        newFragments.push({
          id: `frag-${i}`,
          x: centerX + (Math.random() - 0.5) * 30,
          y: centerY + (Math.random() - 0.5) * 20,
          angle,
          delay: Math.random() * 0.05,
        });
      }
      
      setSparks(newSparks);
      setFragments(newFragments);
    }
  }, [active, centerX, centerY]);

  if (!active) return null;

  return (
    <>
      {sparks.map((spark) => (
        <Spark key={spark.id} {...spark} />
      ))}
      {fragments.map((frag) => (
        <MetalFragment key={frag.id} {...frag} />
      ))}
    </>
  );
}

// Metallic flash effect on collision - bright white/orange flash
function CollisionFlash({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Initial bright white flash */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, rgba(255,200,100,0.5) 30%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          {/* Secondary orange/red heat glow */}
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(255,100,0,0.4) 0%, rgba(255,50,0,0.2) 40%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

// Metallic impact shockwave - multiple rings with heat distortion look
function Shockwave({ active, centerX, centerY }) {
  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Primary impact ring - white hot */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              position: 'absolute',
              left: centerX - 60,
              top: centerY - 60,
              width: 120,
              height: 120,
              borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.9)',
              boxShadow: '0 0 20px rgba(255,200,100,0.5), inset 0 0 20px rgba(255,150,50,0.3)',
              pointerEvents: 'none',
            }}
          />
          {/* Secondary ring - orange heat */}
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            style={{
              position: 'absolute',
              left: centerX - 50,
              top: centerY - 50,
              width: 100,
              height: 100,
              borderRadius: '50%',
              border: '2px solid rgba(255,150,50,0.7)',
              boxShadow: '0 0 15px rgba(255,100,0,0.4)',
              pointerEvents: 'none',
            }}
          />
          {/* Third ring - cooler */}
          <motion.div
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            style={{
              position: 'absolute',
              left: centerX - 40,
              top: centerY - 40,
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '1px solid rgba(255,100,50,0.5)',
              pointerEvents: 'none',
            }}
          />
        </>
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

{/* Ambient heat glow during collision - metallic orange/red */}
  <AnimatePresence>
  {phase >= 2 && phase < 4 && (
  <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 0.4 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
  style={{
  position: 'absolute',
  inset: 0,
  background: 'radial-gradient(ellipse at center, rgba(255,150,50,0.2) 0%, rgba(255,80,0,0.1) 40%, transparent 70%)',
  pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
