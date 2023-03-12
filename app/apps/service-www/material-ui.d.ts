import { PaletteOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  export interface PaletteOptions {
    tierColor: {
      common: string;
      uncommon: string;
      rare: string;
      epic: string;
      mythical: string;
      legendary: string;
    };
  }

}
