// AnimatedLoader.js (MODIFIED)

import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';
import { shouldExcludePath } from '../../config/loaderExclusions';

const AnimatedLoader = () => {
  return (
    // A semi-transparent overlay for page transitions
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999]">
      
      {/* Animation container */}
      <div className="relative flex justify-center items-center w-48 h-32">
        {/* The streak container */}
        <div className="absolute w-24 h-24 z-0">
          <div className="streak"></div>
          <div className="streak"></div>
          <div className="streak"></div>
          <div className="streak"></div>
          <div className="streak"></div>
          <div className="streak"></div>
        </div>

        {/* The Logo "car" */}
        <img
          src="/supplylink-logo.png"
          alt="SupplyLink Logo"
          className="h-24 relative z-20 animate-logo-bob" 
        />
        
        {/* The scrolling road */}
        <div className="road-container absolute bottom-0 z-10">
          <div className="road-track">
            <div className="road-dash"></div>
            <div className="road-dash"></div>
            <div className="road-dash"></div>
            <div className="road-dash"></div>
            <div className="road-dash"></div>
            <div className="road-dash"></div>
            <div className="road-dash"></div>
            <div className="road-dash"></div>
          </div>
        </div>
        
        {/* All animation styles are now self-contained in this component */}
        <style>{`
          /* Logo "bob" animation */
          @keyframes logoBob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-logo-bob {
            animation: logoBob 1.2s ease-in-out infinite;
          }

          /* Animation for the wind streaks */
          @keyframes windStream {
            0% { transform: translate(0, 0) scaleX(0.5); opacity: 1; }
            100% { transform: translate(-250px, var(--translate-y)) scaleX(1); opacity: 0; }
          }
          
          /* Style for a single streak of wind */
          .streak {
            position: absolute; width: 50px; height: 2px;
            background: linear-gradient(to left, transparent, rgba(139, 195, 255, 0.6));
            border-radius: 2px;
            opacity: 0;
            animation: windStream 1.2s ease-in infinite;
            transform-origin: left;
          }
          
          /* Streaks starting positions */
          .streak:nth-child(1) { top: 30%; left: 70%; --translate-y: -8px; animation-delay: 0.1s; }
          .streak:nth-child(2) { top: 45%; left: 80%; --translate-y: 5px; animation-delay: 0.25s; height: 1px; }
          .streak:nth-child(3) { top: 60%; left: 75%; --translate-y: -5px; animation-delay: 0.4s; }
          .streak:nth-child(4) { top: 75%; left: 80%; --translate-y: 8px; animation-delay: 0.65s; height: 1px; }
          .streak:nth-child(5) { top: 55%; left: 70%; --translate-y: 0px; animation-delay: 0.8s; }
          .streak:nth-child(6) { top: 40%; left: 75%; --translate-y: -5px; animation-delay: 1s; }

          /* Animation and styles for the scrolling road */
          @keyframes moveRoad {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .road-container {
            width: 200px; height: 10px; overflow: hidden;
          }
          .road-track {
            width: 200%; height: 100%; display: flex; align-items: center;
            justify-content: space-around; animation: moveRoad 1s linear infinite;
          }
          .road-dash {
            height: 4px; background-color: rgba(255, 255, 255, 0.4); border-radius: 2px;
          }
          .road-dash:nth-child(odd) { width: 40px; }
          .road-dash:nth-child(even) { width: 20px; }
        `}</style>
      </div>

    </div>
  );
};

export default AnimatedLoader;
 
// RouteChangeLoader: toggles global loader during route transitions
// Note: colocated here to keep loader-related utilities together
export const RouteChangeLoader = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const { showLoader, hideLoader } = useLoading();
  const raf1 = useRef(null);
  const raf2 = useRef(null);
  const minTimer = useRef(null);
  const startMsRef = useRef(0);
  const prevPathRef = useRef(null);

  useEffect(() => {
    // Trigger only on PUSH or REPLACE navigations (actual page changes)
    const nextPath = location.pathname || '';
    const prevPath = prevPathRef.current || '';
    const excluded = shouldExcludePath(nextPath);

    if (navigationType === 'PUSH' || navigationType === 'REPLACE') {
      // Skip loader for excluded paths
      if (!excluded) {
        startMsRef.current = performance.now();
        showLoader();
        // Hide on first paint of the new route, but not before 500ms total
        raf1.current = requestAnimationFrame(() => {
          raf2.current = requestAnimationFrame(() => {
            const elapsed = performance.now() - startMsRef.current;
            const remaining = Math.max(0, 500 - elapsed);
            if (remaining === 0) {
              hideLoader();
            } else {
              if (minTimer.current) clearTimeout(minTimer.current);
              minTimer.current = setTimeout(() => hideLoader(), remaining);
            }
          });
        });
      }
    }

    // Update previous path for next navigation
    prevPathRef.current = nextPath;

    return () => {
      if (raf1.current) cancelAnimationFrame(raf1.current);
      if (raf2.current) cancelAnimationFrame(raf2.current);
      if (minTimer.current) clearTimeout(minTimer.current);
      raf1.current = null;
      raf2.current = null;
      minTimer.current = null;
      // Do not hide here; allow new page or timeout to control hiding
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  return null;
};