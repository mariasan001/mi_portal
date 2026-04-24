import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { cx } from '@/utils/cx';
import s from './NominaToolbar.module.css';

type ShellProps = {
  aside?: ReactNode;
  children: ReactNode;
  compactLabelGap?: boolean;
};

export function NominaToolbarShell({
  aside,
  children,
  compactLabelGap = false,
}: ShellProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={cx(s.toolbar, aside && s.withAside)}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className={cx(s.left, compactLabelGap && s.leftCompact)}>{children}</div>
      {aside ? <div className={s.right}>{aside}</div> : null}
    </motion.section>
  );
}

type SurfaceProps = {
  children: ReactNode;
};

export function NominaToolbarSurface({ children }: SurfaceProps) {
  return <div className={s.searchSurface}>{children}</div>;
}

type LabelProps = {
  children: ReactNode;
  htmlFor?: string;
};

export function NominaToolbarLabel({ children, htmlFor }: LabelProps) {
  return (
    <label className={s.label} htmlFor={htmlFor}>
      {children}
    </label>
  );
}

type InputProps = {
  icon: ReactNode;
  input: ReactNode;
};

export function NominaToolbarInput({ icon, input }: InputProps) {
  return (
    <div className={s.inputWrap}>
      <span className={s.icon}>{icon}</span>
      {input}
    </div>
  );
}

type SecondaryInputProps = {
  label: string;
  input: ReactNode;
};

export function NominaToolbarSecondaryInput({
  label,
  input,
}: SecondaryInputProps) {
  return (
    <div className={s.secondaryInput}>
      <div className={s.secondaryInner}>
        <span className={s.secondaryLabel}>{label}</span>
        {input}
      </div>
    </div>
  );
}

type ButtonTone = 'primary' | 'secondary' | 'accent';

type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  onClick: () => void;
  tone?: ButtonTone;
};

export function NominaToolbarButton({
  children,
  disabled = false,
  icon,
  onClick,
  tone = 'primary',
}: ButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  const toneClass =
    tone === 'accent'
      ? s.accentButton
      : tone === 'secondary'
        ? s.secondaryButton
        : s.primaryButton;

  return (
    <motion.button
      type="button"
      className={cx(s.button, toneClass)}
      onClick={onClick}
      disabled={disabled}
      whileHover={
        !shouldReduceMotion && !disabled
          ? { y: -1, transition: { duration: 0.16 } }
          : undefined
      }
      whileTap={!shouldReduceMotion && !disabled ? { scale: 0.99 } : undefined}
    >
      {icon}
      <span>{children}</span>
    </motion.button>
  );
}
