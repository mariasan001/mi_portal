// src/app/fonts.ts
import localFont from 'next/font/local';

export const gotham = localFont({
  variable: '--font-gotham',
  display: 'swap',
  src: [
    { path: '../../public/font/Gotham Thin.otf', weight: '100', style: 'normal' },
    { path: '../../public/font/Gotham Extra Light.otf', weight: '200', style: 'normal' },
    { path: '../../public/font/Gotham Light.otf', weight: '300', style: 'normal' },
    { path: '../../public/font/Gotham Book.otf', weight: '400', style: 'normal' },
    { path: '../../public/font/Gotham Medium.otf', weight: '500', style: 'normal' },
    { path: '../../public/font/Gotham Bold.otf', weight: '700', style: 'normal' },
    { path: '../../public/font/Gotham Black.otf', weight: '900', style: 'normal' },

    /* Italics (solo los que existan y uses) */
    { path: '../../public/font/Gotham Italic.otf', weight: '400', style: 'italic' },
    { path: '../../public/font/Gotham Thin Italic.otf', weight: '100', style: 'italic' },
    { path: '../../public/font/Gotham Extra Light Italic.otf', weight: '200', style: 'italic' },
    { path: '../../public/font/Gotham ItalicBold.otf', weight: '700', style: 'italic' },
  ],
});