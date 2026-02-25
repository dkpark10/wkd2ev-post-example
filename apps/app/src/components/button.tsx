'use client';

import { cva } from 'class-variance-authority';
import {
  forwardRef,
  type PropsWithChildren,
  type ComponentType,
  type SVGProps as ReactSVGProps,
  type ComponentPropsWithoutRef,
} from 'react';
import { token, rawToken } from '@/utils/token';
import { cn } from '@/utils/cn';
import Spinner from '@atlaskit/spinner';

const buttonVariants = cva(
  [
    // layout
    'inline-flex',
    'box-border',
    'w-auto',
    'max-w-full',
    'relative',
    'items-baseline',
    'justify-center',
    'shrink-0',
    // spacing
    token('gap', 'space.050'),
    // border
    token('rounded', 'radius.small'),
    // sizing
    'h-8',
    // typography
    `[font-weight:${rawToken('font.weight.medium')}]`,
    // padding
    token('py', 'space.075'),
    token('px', 'space.150'),
    // alignment
    'text-center',
    'align-middle',
    // interaction
    'cursor-pointer',
    'transition-[background]',
    'duration-100',
    'ease-out',
    // ::after pseudo element
    'after:rounded-[inherit]',
    token('after:inset', 'space.0'),
    'after:border-solid',
    `after:border-[length:${rawToken('border.width')}]`,
    'after:border-transparent',
    'after:pointer-events-none',
    'after:absolute',
    `after:content-['']`,
  ],
  {
    variants: {
      appearance: {
        default: [
          // root
          token('bg', 'color.background.neutral.subtle'),
          token('text', 'color.text.subtle'),
          'border',
          token('border', 'color.border'),
          // states
          token('visited:text', 'color.text.subtle'),
          token('hover:text', 'color.text.subtle'),
          token('active:text', 'color.text.subtle'),
          token('focus:text', 'color.text.subtle'),
          // interactive
          token('hover:bg', 'color.background.neutral.subtle.hovered'),
          token('active:bg', 'color.background.neutral.subtle.pressed'),
        ],
        primary: [
          // root
          token('bg', 'color.background.brand.bold'),
          token('text', 'color.text.inverse'),
          // states
          token('visited:text', 'color.text.inverse'),
          token('hover:text', 'color.text.inverse'),
          token('active:text', 'color.text.inverse'),
          token('focus:text', 'color.text.inverse'),
          // interactive
          token('hover:bg', 'color.background.brand.bold.hovered'),
          token('active:bg', 'color.background.brand.bold.pressed'),
        ],
        warning: [
          // root
          token('bg', 'color.background.warning.bold'),
          token('text', 'color.text.warning.inverse'),
          // states
          token('visited:text', 'color.text.warning.inverse'),
          token('hover:text', 'color.text.warning.inverse'),
          token('active:text', 'color.text.warning.inverse'),
          token('focus:text', 'color.text.warning.inverse'),
          // interactive
          token('hover:bg', 'color.background.warning.bold.hovered'),
          token('active:bg', 'color.background.warning.bold.pressed'),
        ],
        danger: [
          // root
          token('bg', 'color.background.danger.bold'),
          token('text', 'color.text.inverse'),
          // states
          token('visited:text', 'color.text.inverse'),
          token('hover:text', 'color.text.inverse'),
          token('active:text', 'color.text.inverse'),
          token('focus:text', 'color.text.inverse'),
          // interactive
          token('hover:bg', 'color.background.danger.bold.hovered'),
          token('active:bg', 'color.background.danger.bold.pressed'),
        ],
        discovery: [
          // root
          token('bg', 'color.background.discovery.bold'),
          token('text', 'color.text.inverse'),
          // states
          token('visited:text', 'color.text.inverse'),
          token('hover:text', 'color.text.inverse'),
          token('active:text', 'color.text.inverse'),
          token('focus:text', 'color.text.inverse'),
          // interactive
          token('hover:bg', 'color.background.discovery.bold.hovered'),
          token('active:bg', 'color.background.discovery.bold.pressed'),
        ],
        subtle: [
          // root
          'bg-transparent',
          token('text', 'color.text.subtle'),
          // states
          token('visited:text', 'color.text.subtle'),
          token('hover:text', 'color.text.subtle'),
          token('active:text', 'color.text.subtle'),
          token('focus:text', 'color.text.subtle'),
          // interactive
          token('hover:bg', 'color.background.neutral.subtle.hovered'),
          token('active:bg', 'color.background.neutral.subtle.pressed'),
        ],
      },
      spacing: {
        default: '',
        compact: [
          token('gap-x', 'space.050'),
          'h-6',
          token('py', 'space.025'),
          token('px', 'space.150'),
          'align-middle',
        ],
      },
      loading: {
        true: [
          'cursor-progress',
          token('px', 'space.500'),
        ],
        false: '',
      },
      selected: {
        true: '',
        false: '',
      },
      disabled: {
        true: [
          'cursor-not-allowed',
          token('text', 'color.text.disabled'),
          token('hover:text', 'color.text.disabled'),
          token('active:text', 'color.text.disabled'),
          'bg-transparent',
          'hover:bg-transparent',
          'active:bg-transparent',
          `after:${token('border', 'color.border.disabled')}`,
        ],
        false: '',
      },
    },
    compoundVariants: [
      // selected + default/primary/subtle
      {
        selected: true,
        appearance: ['default', 'primary', 'subtle'],
        class: [
          token('bg', 'color.background.selected'),
          token('text', 'color.text.selected'),
          `after:${token('border', 'color.border.selected')}`,
          token('visited:text', 'color.text.selected'),
          token('hover:text', 'color.text.selected'),
          token('active:text', 'color.text.selected'),
          token('focus:text', 'color.text.selected'),
          token('hover:bg', 'color.background.selected.hovered'),
          token('active:bg', 'color.background.selected.pressed'),
        ],
      },
      // selected + warning
      {
        selected: true,
        appearance: 'warning',
        class: [
          token('bg', 'color.background.selected'),
          token('text', 'color.text.selected'),
          token('hover:text', 'color.text.selected'),
          token('active:text', 'color.text.selected'),
          token('hover:bg', 'color.background.selected'),
          token('active:bg', 'color.background.selected'),
        ],
      },
      // selected + danger
      {
        selected: true,
        appearance: 'danger',
        class: [
          token('bg', 'color.background.selected'),
          token('text', 'color.text.selected'),
          token('hover:text', 'color.text.selected'),
          token('active:text', 'color.text.selected'),
          token('hover:bg', 'color.background.selected'),
          token('active:bg', 'color.background.selected'),
        ],
      },
      // selected + discovery
      {
        selected: true,
        appearance: 'discovery',
        class: [
          token('bg', 'color.background.selected'),
          token('text', 'color.text.selected'),
          token('hover:text', 'color.text.selected'),
          token('active:text', 'color.text.selected'),
          token('hover:bg', 'color.background.selected'),
          token('active:bg', 'color.background.selected'),
        ],
      },
    ],
    defaultVariants: {
      appearance: 'default',
      spacing: 'default',
    },
  }
);

type Appearance =
  'default'
  | 'danger'
  | 'primary'
  | 'subtle'
  | 'warning'
  | 'discovery';

interface IconProp extends ReactSVGProps<SVGSVGElement> {
  glyph?: ComponentType<{
    'data-testid'?: string;
    'aria-label'?: string;
    className?: string;
  }>;
}

type ButtonProps = PropsWithChildren & ComponentPropsWithoutRef<"button"> & {
  iconAfter?: IconProp;
  iconBefore?: IconProp;
  isLoading?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  appearance?: Appearance;
  spacing?: 'compact' | 'default';
  className?: string;
};

export default forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  props,
  ref
) {
  const {
    children,
    appearance,
    spacing,
    isLoading,
    isDisabled,
    className,
    isSelected,
    ...rest
  } = props;

  return (
    <button
      ref={ref}
      disabled={isDisabled || false}
      className={cn(
        buttonVariants({ appearance, spacing, loading: isLoading, disabled: isDisabled, selected: isSelected }),
        className
      )}
      {...rest}
    >
      {!isLoading && children}
      {isLoading && (
        <span
          className={cn(
            'flex',
            'absolute',
            'items-center',
            'justify-center',
            'overflow-hidden',
            token('inset', 'space.0'),
          )}
        >
          <Spinner appearance="invert" size="medium" />
        </span>
      )}
    </button>
  );
});