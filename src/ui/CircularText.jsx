import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const getRotationTransition = (duration, loop = true) => ({
  ease: 'linear',
  duration,
  type: 'tween',
  repeat: loop ? Infinity : 0,
  repeatType: 'loop'
});

const getTransition = (duration) => ({
  rotate: getRotationTransition(duration),
  scale: {
    type: 'spring',
    damping: 20,
    stiffness: 300
  }
});

const CircularText = ({ text, spinDuration = 20, onHover = 'speedUp', className = '' }) => {
  const letters = Array.from(text);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      rotate: 360,
      scale: 1,
      transition: getTransition(spinDuration)
    });
  }, [spinDuration, controls]);

  const handleHoverStart = () => {
    if (!onHover) return;

    let transitionConfig;
    let scaleVal = 1;

    switch (onHover) {
      case 'slowDown':
        transitionConfig = getTransition(spinDuration * 2);
        break;
      case 'speedUp':
        transitionConfig = getTransition(spinDuration / 4);
        break;
      case 'pause':
        transitionConfig = {
          rotate: { type: 'spring', damping: 20, stiffness: 300 },
          scale: { type: 'spring', damping: 20, stiffness: 300 }
        };
        scaleVal = 1;
        break;
      case 'goBonkers':
        transitionConfig = getTransition(spinDuration / 20);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration);
    }

    controls.start({
      rotate: 360,
      scale: scaleVal,
      transition: transitionConfig
    });
  };

  const handleHoverEnd = () => {
    controls.start({
      rotate: 360,
      scale: 1,
      transition: getTransition(spinDuration)
    });
  };

  return (
    <motion.div
      className={`m-0 mx-auto rounded-full w-[200px] h-[200px] relative text-blue-400 dark:text-white font-black text-center cursor-pointer origin-center ${className}`}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const angle = (360 / letters.length) * i - 90; // Start from top (-90deg)
        const radius = 80; // Radius of the circle
        const radian = (angle * Math.PI) / 180;
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;
        const transform = `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`;

        return (
          <span
            key={i}
            className="absolute inline-block text-2xl transition-all duration-500 ease-[cubic-bezier(0,0,0,1)]"
            style={{ 
              transform, 
              WebkitTransform: transform,
              left: '50%',
              top: '50%',
              transformOrigin: '0 0',
              textShadow: '0 0 10px currentColor, 0 0 20px currentColor'
            }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
