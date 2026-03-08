/**
 * Centralized font configuration for the application.
 * All font dropdowns (quote, title, signature) pull from these lists.
 */

export interface FontOption {
  name: string;
  value: string;
  category: 'english' | 'hindi' | 'gujarati' | 'decorative';
}

export const FONTS: FontOption[] = [
  // ── English Fonts ──
  { name: 'Poppins', value: 'Poppins', category: 'english' },
  { name: 'Inter', value: 'Inter', category: 'english' },
  { name: 'Roboto', value: 'Roboto', category: 'english' },
  { name: 'Montserrat', value: 'Montserrat', category: 'english' },
  { name: 'Open Sans', value: 'Open Sans', category: 'english' },
  { name: 'Lato', value: 'Lato', category: 'english' },
  { name: 'Playfair Display', value: 'Playfair Display', category: 'english' },
  { name: 'Merriweather', value: 'Merriweather', category: 'english' },
  { name: 'Lora', value: 'Lora', category: 'english' },
  { name: 'Raleway', value: 'Raleway', category: 'english' },
  { name: 'Oswald', value: 'Oswald', category: 'english' },
  { name: 'Nunito', value: 'Nunito', category: 'english' },
  { name: 'Quicksand', value: 'Quicksand', category: 'english' },
  { name: 'Ubuntu', value: 'Ubuntu', category: 'english' },
  { name: 'Source Sans 3', value: 'Source Sans 3', category: 'english' },
  { name: 'Josefin Sans', value: 'Josefin Sans', category: 'english' },
  { name: 'Dancing Script', value: 'Dancing Script', category: 'english' },
  { name: 'Pacifico', value: 'Pacifico', category: 'english' },
  { name: 'Caveat', value: 'Caveat', category: 'english' },
  { name: 'Bebas Neue', value: 'Bebas Neue', category: 'english' },
  { name: 'Abril Fatface', value: 'Abril Fatface', category: 'english' },
  { name: 'Comfortaa', value: 'Comfortaa', category: 'english' },
  { name: 'Righteous', value: 'Righteous', category: 'english' },
  { name: 'Permanent Marker', value: 'Permanent Marker', category: 'english' },
  { name: 'Satisfy', value: 'Satisfy', category: 'english' },
  { name: 'Great Vibes', value: 'Great Vibes', category: 'english' },
  { name: 'Cinzel', value: 'Cinzel', category: 'english' },
  { name: 'Archivo Black', value: 'Archivo Black', category: 'english' },

  // ── Hindi (Devanagari) Fonts ──
  { name: 'Noto Sans Devanagari', value: 'Noto Sans Devanagari', category: 'hindi' },
  { name: 'Noto Serif Devanagari', value: 'Noto Serif Devanagari', category: 'hindi' },
  { name: 'Tiro Devanagari Hindi', value: 'Tiro Devanagari Hindi', category: 'hindi' },
  { name: 'Mukta', value: 'Mukta', category: 'hindi' },
  { name: 'Hind', value: 'Hind', category: 'hindi' },
  { name: 'Baloo 2', value: 'Baloo 2', category: 'hindi' },
  { name: 'Kalam', value: 'Kalam', category: 'hindi' },
  { name: 'Rajdhani', value: 'Rajdhani', category: 'hindi' },
  { name: 'Yatra One', value: 'Yatra One', category: 'hindi' },
  { name: 'Modak', value: 'Modak', category: 'hindi' },
  { name: 'Martel', value: 'Martel', category: 'hindi' },
  { name: 'Gotu', value: 'Gotu', category: 'hindi' },

  // ── Gujarati Fonts ──
  { name: 'Noto Sans Gujarati', value: 'Noto Sans Gujarati', category: 'gujarati' },
  { name: 'Noto Serif Gujarati', value: 'Noto Serif Gujarati', category: 'gujarati' },
  { name: 'Hind Vadodara', value: 'Hind Vadodara', category: 'gujarati' },
  { name: 'Baloo Bhai 2', value: 'Baloo Bhai 2', category: 'gujarati' },
  { name: 'Mukta Vaani', value: 'Mukta Vaani', category: 'gujarati' },
  { name: 'Shrikhand', value: 'Shrikhand', category: 'gujarati' },
  { name: 'Rasa', value: 'Rasa', category: 'gujarati' },

  // ── Decorative / Display ──
  { name: 'Lobster', value: 'Lobster', category: 'decorative' },
  { name: 'Bangers', value: 'Bangers', category: 'decorative' },
  { name: 'Press Start 2P', value: 'Press Start 2P', category: 'decorative' },
  { name: 'Bungee', value: 'Bungee', category: 'decorative' },
  { name: 'Alfa Slab One', value: 'Alfa Slab One', category: 'decorative' },
];

/**
 * Returns Google Fonts families string for WebFontLoader
 */
export function getGoogleFontFamilies(): string[] {
  return FONTS.map(f => `${f.value}:400,700`);
}

/**
 * Category labels for optgroups
 */
export const FONT_CATEGORY_LABELS: Record<string, string> = {
  english: '🇬🇧 English',
  hindi: '🇮🇳 Hindi (हिंदी)',
  gujarati: '🇮🇳 Gujarati (ગુજરાતી)',
  decorative: '✨ Decorative',
};
