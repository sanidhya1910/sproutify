import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge has to be told about this project's custom type scale.
 *
 * Without this, it only recognises Tailwind's stock font sizes (xs, sm,
 * base, lg, xl, 2xl, ...). Every custom key here — `text-body`, `text-h4`,
 * `text-caption`, `text-display-lg` and the rest — falls through to its
 * `text-color` group instead, so it treats a SIZE class and a COLOR class as
 * conflicting and silently drops whichever came first.
 *
 * The visible symptom was the default Button: its variant string is
 * `bg-primary text-primary-foreground ...` and its size string is
 * `text-body`, so the near-white foreground was discarded and the label
 * inherited `--foreground` (near-black) on the deep green fill — a 1.72:1
 * contrast failure on every primary CTA in the app. The same collision
 * applied anywhere a custom text size met a text colour through `cn()`.
 *
 * Keys must stay in sync with `theme.extend.fontSize` in tailwind.config.ts.
 */
const FONT_SIZES = [
  'display-2xl',
  'display-xl',
  'display-lg',
  'h1',
  'h2',
  'h3',
  'h4',
  'body-lg',
  'body',
  'body-sm',
  'label',
  'caption',
  'overline',
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...FONT_SIZES] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
