import { useState, useEffect } from 'react';

// Define breakpoint values that match tailwind.config.ts
const breakpoints = {
  xx: 1,
  xs: 400,
  ss: 600,
  sm: 800,
  md: 1000,
  lg: 1200,
  xl: 1700
};

type Breakpoint = keyof typeof breakpoints;

/**
 * Custom hook for responsive design
 * @returns Object with boolean values for each breakpoint
 */
export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  // Create an object with boolean values for each breakpoint
  const responsive = {
    isXx: windowSize.width >= breakpoints.xx,
    isXs: windowSize.width >= breakpoints.xs,
    isSs: windowSize.width >= breakpoints.ss,
    isSm: windowSize.width >= breakpoints.sm,
    isMd: windowSize.width >= breakpoints.md,
    isLg: windowSize.width >= breakpoints.lg,
    isXl: windowSize.width >= breakpoints.xl,
    // Additional helpers
    isMobile: windowSize.width < breakpoints.sm,
    isTablet: windowSize.width >= breakpoints.sm && windowSize.width < breakpoints.lg,
    isDesktop: windowSize.width >= breakpoints.lg,
    // Current active breakpoint
    active: (Object.keys(breakpoints) as Breakpoint[])
      .reverse()
      .find(key => windowSize.width >= breakpoints[key]) || 'xx',
    // Window dimensions
    width: windowSize.width,
    height: windowSize.height
  };

  return responsive;
}

/**
 * Utility function to conditionally apply styles based on breakpoints
 * @param styles Object with breakpoint keys and style values
 * @returns Style object for the current breakpoint
 */
export function responsiveStyle<T>(styles: Partial<Record<Breakpoint, T>>): T | undefined {
  // This function is meant to be used with the useResponsive hook
  // It's a client-side only function, so we need to check if window is defined
  if (typeof window === 'undefined') return undefined;
  
  const width = window.innerWidth;
  
  // Find the largest breakpoint that is smaller than the current width
  const breakpoint = (Object.keys(breakpoints) as Breakpoint[])
    .reverse()
    .find(key => width >= breakpoints[key]);
    
  return breakpoint ? styles[breakpoint] : undefined;
}
