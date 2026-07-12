/**
 * CSS transition utilities to replace MUI Collapse/Fade/Grow/Zoom/Slide.
 * These use Tailwind transition classes and CSS animations.
 */

import * as React from 'react';
import { cn } from './utils';

interface TransitionProps {
  in: boolean;
  children: React.ReactNode;
  timeout?: number;
  className?: string;
  unmountOnExit?: boolean;
  mountOnEnter?: boolean;
}

// ── Collapse ─────────────────────────────────────────────────────
export function Collapse({
  in: open,
  children,
  timeout = 300,
  className,
  unmountOnExit = true,
}: TransitionProps) {
  const [mounted, setMounted] = React.useState(open);
  const [height, setHeight] = React.useState(open ? 'auto' : '0px');
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) {
      setMounted(true);
      // Measure and set height for animation
      requestAnimationFrame(() => {
        if (ref.current) {
          setHeight(`${ref.current.scrollHeight}px`);
        }
      });
    } else {
      if (ref.current) {
        setHeight(`${ref.current.scrollHeight}px`);
      }
      requestAnimationFrame(() => {
        setHeight('0px');
      });
    }
  }, [open]);

  React.useEffect(() => {
    if (!open && unmountOnExit) {
      const timer = setTimeout(() => setMounted(false), timeout);
      return () => clearTimeout(timer);
    }
  }, [open, timeout, unmountOnExit]);

  if (!mounted && !open) return null;

  return (
    <div
      ref={ref}
      className={cn('overflow-hidden transition-all', className)}
      style={{
        maxHeight: height,
        opacity: open ? 1 : 0,
        transitionDuration: `${timeout}ms`,
      }}
      onTransitionEnd={() => {
        if (open) setHeight('auto');
      }}
    >
      {children}
    </div>
  );
}

// ── Fade ─────────────────────────────────────────────────────────
export function Fade({
  in: open,
  children,
  timeout = 300,
  className,
  unmountOnExit = true,
}: TransitionProps) {
  const [mounted, setMounted] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      setMounted(true);
    } else if (unmountOnExit) {
      const timer = setTimeout(() => setMounted(false), timeout);
      return () => clearTimeout(timer);
    }
  }, [open, timeout, unmountOnExit]);

  if (!mounted && !open) return null;

  return (
    <div
      className={cn('transition-opacity', className)}
      style={{
        opacity: open ? 1 : 0,
        transitionDuration: `${timeout}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Grow ─────────────────────────────────────────────────────────
export function Grow({
  in: open,
  children,
  timeout = 300,
  className,
  unmountOnExit = true,
}: TransitionProps) {
  const [mounted, setMounted] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      setMounted(true);
    } else if (unmountOnExit) {
      const timer = setTimeout(() => setMounted(false), timeout);
      return () => clearTimeout(timer);
    }
  }, [open, timeout, unmountOnExit]);

  if (!mounted && !open) return null;

  return (
    <div
      className={cn('transition-all', className)}
      style={{
        opacity: open ? 1 : 0,
        transform: open ? 'scale(1)' : 'scale(0.75)',
        transitionDuration: `${timeout}ms`,
        transformOrigin: 'center',
      }}
    >
      {children}
    </div>
  );
}

// ── Zoom ─────────────────────────────────────────────────────────
export function Zoom({
  in: open,
  children,
  timeout = 200,
  className,
  unmountOnExit = true,
}: TransitionProps) {
  const [mounted, setMounted] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      setMounted(true);
    } else if (unmountOnExit) {
      const timer = setTimeout(() => setMounted(false), timeout);
      return () => clearTimeout(timer);
    }
  }, [open, timeout, unmountOnExit]);

  if (!mounted && !open) return null;

  return (
    <div
      className={cn('transition-all', className)}
      style={{
        opacity: open ? 1 : 0,
        transform: open ? 'scale(1)' : 'scale(0)',
        transitionDuration: `${timeout}ms`,
        transformOrigin: 'center',
      }}
    >
      {children}
    </div>
  );
}

// ── Slide ────────────────────────────────────────────────────────
type SlideDirection = 'left' | 'right' | 'up' | 'down';

interface SlideProps extends TransitionProps {
  direction?: SlideDirection;
}

export function Slide({
  in: open,
  children,
  timeout = 300,
  className,
  direction = 'left',
  unmountOnExit = true,
}: SlideProps) {
  const [mounted, setMounted] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      setMounted(true);
    } else if (unmountOnExit) {
      const timer = setTimeout(() => setMounted(false), timeout);
      return () => clearTimeout(timer);
    }
  }, [open, timeout, unmountOnExit]);

  if (!mounted && !open) return null;

  const transforms: Record<SlideDirection, { open: string; closed: string }> = {
    left: { open: 'translateX(0)', closed: 'translateX(-100%)' },
    right: { open: 'translateX(0)', closed: 'translateX(100%)' },
    up: { open: 'translateY(0)', closed: 'translateY(-100%)' },
    down: { open: 'translateY(0)', closed: 'translateY(100%)' },
  };

  return (
    <div
      className={cn('transition-all', className)}
      style={{
        transform: open ? transforms[direction].open : transforms[direction].closed,
        opacity: open ? 1 : 0,
        transitionDuration: `${timeout}ms`,
      }}
    >
      {children}
    </div>
  );
}
