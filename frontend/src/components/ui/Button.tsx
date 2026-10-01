import type { ComponentProps } from 'react';
import { Link } from 'react-router';

type Variant = 'primary' | 'ghost';
type Size = 'sm' | 'md';

const base =
  'inline-flex items-center justify-center gap-2 rounded-md border font-mono transition-colors';

const variants: Record<Variant, string> = {
  primary: 'border-accent bg-accent text-bg hover:bg-accent/85 font-semibold',
  ghost: 'border-line-strong bg-surface/60 text-fg hover:border-accent/60 hover:text-accent',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
};

export function buttonClass(variant: Variant = 'ghost', size: Size = 'md', extra = '') {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className = '', ...props }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
