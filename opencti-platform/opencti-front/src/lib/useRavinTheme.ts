import { useState, useSyncExternalStore } from 'react';

export interface RavinPalette {
  bg: string;
  surface: string;
  elevated: string;
  surface2: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  danger: string;
  dangerLight: string;
  dangerDark: string;
  success: string;
  successDark: string;
  warning: string;
  text: string;
  textMuted: string;
  textLight: string;
}

export interface RavinTheme {
  palette: RavinPalette;
  spacing: (n: number) => string;
  breakpoints: { up: (bp: string) => string };
  mode: 'dark' | 'light';
}

const BREAKPOINTS: Record<string, number> = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

function getThemeMode(): 'dark' | 'light' {
  const attr = document.body.getAttribute('data-theme');
  return attr === 'light' ? 'light' : 'dark';
}

function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function getSnapshot(): 'dark' | 'light' {
  return getThemeMode();
}

function getServerSnapshot(): 'dark' | 'light' {
  return 'dark';
}

export function useRavinTheme(): RavinTheme {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    palette: {
      bg: 'var(--ravin-bg)',
      surface: 'var(--ravin-surface)',
      elevated: 'var(--ravin-elevated)',
      surface2: 'var(--ravin-surface-2)',
      border: 'var(--ravin-border)',
      borderStrong: 'var(--ravin-border-strong)',
      primary: 'var(--ravin-primary)',
      primaryLight: 'var(--ravin-primary-light)',
      primaryDark: 'var(--ravin-primary-dark)',
      secondary: 'var(--ravin-secondary)',
      secondaryLight: 'var(--ravin-secondary-light)',
      secondaryDark: 'var(--ravin-secondary-dark)',
      danger: 'var(--ravin-danger)',
      dangerLight: 'var(--ravin-danger-light)',
      dangerDark: 'var(--ravin-danger-dark)',
      success: 'var(--ravin-success)',
      successDark: 'var(--ravin-success-dark)',
      warning: 'var(--ravin-warning)',
      text: 'var(--ravin-text)',
      textMuted: 'var(--ravin-text-muted)',
      textLight: 'var(--ravin-text-light)',
    },
    spacing: (n: number) => `${n * 4}px`,
    breakpoints: {
      up: (bp: string) => `@media (min-width: ${BREAKPOINTS[bp] ?? 0}px)`,
    },
    mode,
  };
}
