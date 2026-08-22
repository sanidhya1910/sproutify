import { createTheme } from '@mui/material/styles';

/**
 * TEMPORARY — deleted in Phase 4 when the last MUI page is rebuilt.
 *
 * This replaces the old 337-line `lib/theme.js`, which was not a design system
 * but a pile of hardcoded hex: seven different greens (the one declared as
 * `palette.primary` had zero consumers), semantic colours that were actively
 * wrong (error = blue, warning = green), a `typography.h1` force-clipped to a
 * gradient that `color` could not override, and global component overrides
 * that stamped a green accent bar and a bouncy lift onto every Card in the
 * app — including dense admin tables.
 *
 * This file exists only so the pages not yet rebuilt don't fall back to MUI's
 * default blue during the migration. It maps MUI onto the real design tokens
 * and deliberately declares NO `components` overrides — that absence is the
 * point, and is what kills all of the above at once.
 */
const muiBridge = createTheme({
  palette: {
    primary: { main: '#14532D', contrastText: '#FBFAF7' },
    secondary: { main: '#1D4ED8' },
    error: { main: '#DC2626' }, // actually red
    warning: { main: '#D97706' }, // actually amber
    success: { main: '#16A34A' },
    info: { main: '#1D4ED8' },
    background: { default: '#FBFAF7', paper: '#FFFFFF' },
    text: { primary: '#26241F', secondary: '#7A756B' },
    divider: '#E4E1D9',
  },
  typography: {
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
  },
  shape: { borderRadius: 10 },
  // NO `components` key. Every override from the old theme is intentionally gone.
});

export default muiBridge;
