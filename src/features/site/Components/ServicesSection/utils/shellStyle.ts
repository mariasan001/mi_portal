import type { CSSProperties } from 'react';
import type { CardItem } from '../constants/ServiceConstants';

type ShellVars = CSSProperties & {
  ['--flor-url']?: string;
  ['--flor-size']?: string;
  ['--flor-x']?: string;
  ['--flor-y']?: string;
  ['--flor-rot']?: string;
  ['--flor-opacity']?: string;
};

export function shellStyle(c: CardItem): ShellVars {
  const base: ShellVars = {
    ['--flor-url']: `url('${c.bgImage}')`,
    ['--flor-size']: 'clamp(40px, 10vw, 70px)',
    ['--flor-x']: '-30px',
    ['--flor-y']: '-25px',
    ['--flor-rot']: '-52deg',
    ['--flor-opacity']: '.95',
  };

  if (c.accent === 'oro') {
    return { ...base, ['--flor-rot']: '-40deg', ['--flor-opacity']: '.93' };
  }

  if (c.accent === 'arena') {
    return { ...base, ['--flor-rot']: '-40deg', ['--flor-y']: '-30px', ['--flor-opacity']: '.92' };
  }

  return base;
}