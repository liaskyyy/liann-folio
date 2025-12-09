import React, { useEffect, useState, memo, useRef, useCallback, useMemo } from 'react';
import { motion } from "framer-motion";
import { supabase } from "../config/supabaseClient";

// =========================================
// 1. LOGOLOOP ANIMATION LOGIC (INTERNAL)
// =========================================

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2
};

const cx = (...parts) => parts.filter(Boolean).join(' ');

const useResizeObserver = (callback, elements, dependencies) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }
    const observers = elements.map(ref => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });
    callback();
    return () => observers.forEach(observer => observer?.disconnect());
  }, [callback, elements, dependencies]);
};

const useImageLoader = (seqRef, onLoad, dependencies) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? [];
    if (images.length === 0) { onLoad(); return; }
    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) onLoad();
    };
    images.forEach(img => {
      if (img.complete) handleImageLoad();
      else {
        img.addEventListener('load', handleImageLoad, { once: true });
        img.addEventListener('error', handleImageLoad, { once: true });
      }
    });
    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageLoad);
      });
    };
  }, [onLoad, seqRef, dependencies]);
};

const useAnimationLoop = (trackRef, offsetRef, isDraggingRef, targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical) => {
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const seqSize = isVertical ? seqHeight : seqWidth;

    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      const transformValue = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`;
      track.style.transform = transformValue;
    }

    const animate = timestamp => {
      if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp;
      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      if (!isDraggingRef.current) {
        const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;
        const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
        velocityRef.current += (target - velocityRef.current) * easingFactor;
        
        if (seqSize > 0) {
          offsetRef.current += velocityRef.current * deltaTime;
        }
      } else {
        velocityRef.current = 0; 
      }

      if (seqSize > 0) {
        let wrappedOffset = ((offsetRef.current % seqSize) + seqSize) % seqSize;
        const transformValue = isVertical
          ? `translate3d(0, ${-wrappedOffset}px, 0)`
          : `translate3d(${-wrappedOffset}px, 0, 0)`;
        track.style.transform = transformValue;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical, trackRef, offsetRef, isDraggingRef]);
};

const LogoLoop = memo(({
    logos,
    speed = 100,
    direction = 'left',
    width = '100%',
    logoHeight = 40,
    gap = 20,
    pauseOnHover = false,
    hoverSpeed,
    fadeOut = true,
    fadeOutColor,
    scaleOnHover = true,
    renderItem,
    className,
    style
  }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const seqRef = useRef(null);
    const offsetRef = useRef(0);
    
    const isDraggingRef = useRef(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const lastOffset = useRef(0);

    const [seqWidth, setSeqWidth] = useState(0);
    const [seqHeight, setSeqHeight] = useState(0);
    const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState(false);
    
    const isVertical = direction === 'up' || direction === 'down';

    const onMouseDown = (e) => {
        isDraggingRef.current = true;
        startX.current = e.pageX;
        startY.current = e.pageY;
        lastOffset.current = offsetRef.current;
        containerRef.current.style.cursor = 'grabbing';
    };

    const onMouseMove = (e) => {
        if (!isDraggingRef.current) return;
        e.preventDefault();
        const delta = isVertical ? (e.pageY - startY.current) : (e.pageX - startX.current);
        offsetRef.current = lastOffset.current - delta;
    };

    const onMouseUp = () => {
        isDraggingRef.current = false;
        if(containerRef.current) containerRef.current.style.cursor = 'grab';
    };

    const onTouchStart = (e) => {
        isDraggingRef.current = true;
        startX.current = e.touches[0].pageX;
        startY.current = e.touches[0].pageY;
        lastOffset.current = offsetRef.current;
    };

    const onTouchMove = (e) => {
        if (!isDraggingRef.current) return;
        const delta = isVertical ? (e.touches[0].pageY - startY.current) : (e.touches[0].pageX - startX.current);
        offsetRef.current = lastOffset.current - delta;
    };

    const effectiveHoverSpeed = useMemo(() => {
      if (hoverSpeed !== undefined) return hoverSpeed;
      if (pauseOnHover) return 0;
      return undefined;
    }, [hoverSpeed, pauseOnHover]);

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      const directionMultiplier = (direction === 'up' || direction === 'left') ? 1 : -1;
      const speedMultiplier = speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction]);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceRect = seqRef.current?.getBoundingClientRect?.();
      const sequenceWidth = sequenceRect?.width ?? 0;
      const sequenceHeight = sequenceRect?.height ?? 0;

      if (isVertical) {
        if (sequenceHeight > 0) {
          setSeqHeight(Math.ceil(sequenceHeight));
          const viewport = containerRef.current?.clientHeight ?? sequenceHeight;
          setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM));
        }
      } else if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth));
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM));
      }
    }, [isVertical]);

    useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical]);
    useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical]);
    useAnimationLoop(trackRef, offsetRef, isDraggingRef, targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical);

    const cssVariables = useMemo(() => ({
        '--logoloop-gap': `${gap}px`,
        '--logoloop-logoHeight': `${logoHeight}px`,
        ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor })
    }), [gap, logoHeight, fadeOutColor]);

    const rootClasses = useMemo(() => cx(
        'relative group cursor-grab active:cursor-grabbing',
        isVertical ? 'overflow-hidden h-full inline-block' : 'overflow-x-hidden',
        className
    ), [isVertical, className]);

    const renderLogoItem = useCallback((item, key) => {
        if (renderItem) {
          return (
            <li key={key} role="listitem" className={cx(
                'flex-none', isVertical ? 'mb-[var(--logoloop-gap)]' : 'mr-[var(--logoloop-gap)]'
            )}>
              {renderItem(item, key)}
            </li>
          );
        }
        return null;
    }, [isVertical, renderItem]);

    const logoLists = useMemo(() => 
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            key={`copy-${copyIndex}`}
            ref={copyIndex === 0 ? seqRef : undefined}
            className={cx('flex items-center', isVertical && 'flex-col')}
            role="list"
          >
            {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
          </ul>
        )), [copyCount, logos, renderLogoItem, isVertical]);

    return (
      <div 
        ref={containerRef} 
        className={rootClasses} 
        style={{ ...cssVariables, ...style }}
        onMouseEnter={() => effectiveHoverSpeed !== undefined && setIsHovered(true)}
        onMouseLeave={() => {
            if (effectiveHoverSpeed !== undefined) setIsHovered(false);
            onMouseUp();
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onMouseUp}
      >
        {fadeOut && (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[clamp(24px,10%,120px)] bg-gradient-to-r from-base-100 dark:from-gray-950 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[clamp(24px,10%,120px)] bg-gradient-to-l from-base-100 dark:from-gray-950 to-transparent" />
          </>
        )}
        <div ref={trackRef} className={cx('flex will-change-transform select-none relative z-0', isVertical ? 'flex-col h-max w-full' : 'flex-row w-max')}>
          {logoLists}
        </div>
      </div>
    );
  }
);
LogoLoop.displayName = 'LogoLoop';


// =========================================
// 2. MAIN TECHSTACK COMPONENT
// =========================================

export default function TechStack() {
  const [skills, setSkills] = useState([]);
  
  // UPDATED DEFAULTS WITH FIXED LOGOS
  const defaultSkills = [
    { id: "temp-1", title: "HTML", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { id: "temp-2", title: "CSS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { id: "temp-3", title: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { id: "temp-4", title: "React", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { id: "temp-5", title: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { id: "temp-6", title: "C++", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
    { id: "temp-7", title: "Java", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { id: "temp-8", title: "MySQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    { id: "temp-9", title: "Node.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { id: "temp-10", title: "Figma", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
    { id: "temp-11", title: "Adobe Ai", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg" },
    { id: "temp-12", title: "Photoshop", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" },
    
    // --- FIXED LOGOS ---
    { id: "temp-13", title: "InDesign", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/indesign/indesign-original.svg" },
    { id: "temp-17", title: "MS Excel", src: "https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg" },
    { id: "temp-18", title: "MS Word", src: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Microsoft_Office_Word_%282019%E2%80%93present%29.svg" },
    
    { id: "temp-14", title: "Canva", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg" },
    { id: "temp-15", title: "UI/UX Design", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-original.svg" },
    { id: "temp-16", title: "Git & GitHub", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", invert_dark: true },
  ];

  useEffect(() => {
    const fetchSkills = async () => {
        try {
          const { data, error } = await supabase
            .from("skills")
            .select("*")
            .order("id", { ascending: true });
    
          if (error) throw error;
          
          if (data && data.length > 0) {
            setSkills(data);
          } else {
            setSkills(defaultSkills);
          }
        } catch (err) {
          console.error("Error fetching skills:", err);
          setSkills(defaultSkills);
        }
      };

    fetchSkills();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.section
      id="skills"
      className="py-20 bg-white dark:bg-gray-950 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-14 text-transparent bg-clip-text bg-gradient-to-r from-[#3246ea] to-blue-400">
          My Skills
        </h2>

        <div className="relative w-full">
           {skills.length > 0 && (
              <LogoLoop
                logos={skills}
                speed={40}
                direction="left"
                gap={60}
                pauseOnHover={true} 
                renderItem={(item) => (
                  <div className="flex items-center gap-4 select-none group/item cursor-pointer">
                    <div className="relative w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover/item:-translate-y-1">
                      <img 
                        src={item.src} 
                        alt={item.title} 
                        className={`w-full h-full object-contain filter drop-shadow-sm pointer-events-none transition-all duration-300 ${(item.invert_dark || item.invertDark) ? 'dark:invert' : ''}`} 
                        draggable={false}
                      />
                    </div>

                    <span className="text-xl font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300 group-hover/item:text-[#3246ea] dark:group-hover/item:text-blue-400">
                      {item.title}
                    </span>
                  </div>
                )}
              />
           )}
        </div>
      </div>
    </motion.section>
  );
}