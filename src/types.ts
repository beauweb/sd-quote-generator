export interface QuoteTemplate {
  id: string;
  name: string;
  backgroundColor: string;
  backgroundGradient?: {
    type: 'solid' | 'linear' | 'radial';
    colors: string[];
    angle?: number;
  };
  textColor: string;
  fontSize: number;
  fontFamily: string;
  textAlignment: 'left' | 'center' | 'right' | 'justify';
  padding: number;
  signatureSize: number;
  signatureColor: string;
  signatureText: string;
  signatureAlignment: 'left' | 'center' | 'right';
  signatureVisible: boolean; // Show/hide toggle for signature
  textStyle: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  lineHeight?: number;
  letterSpacing?: number;
  pattern?: 'dots' | 'lines' | 'waves' | null;
  textShadow?: TextShadowEffect;
  textOutline?: TextOutlineEffect;
  textGradient?: GradientEffect;
  signatureBottomMargin?: number;
  title: string;
}

export interface QuoteSettings extends QuoteTemplate {
  title: string;
  quoteText: string;
  signatureFontFamily?: string;
  textPath?: {
    enabled: boolean;
    radius: number;
    angle: number;
    direction: 'clockwise' | 'counterclockwise';
  };
  backgroundImage?: {
    url: string;
    opacity: number;
    position: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    size: 'cover' | 'contain' | 'auto' | '100%' | '200%' | '50%';
    repeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
    blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';
  };
}

export interface TextShadowEffect {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
  intensity?: number;
  style?: 'normal' | 'multiple' | 'glow';
}

export interface TextOutlineEffect {
  enabled: boolean;
  color: string;
  width: number;
}

export interface GradientEffect {
  enabled: boolean;
  type: 'linear' | 'radial';
  colors: string[];
  angle?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: any;
}

export interface ControlsProps {
  settings: QuoteSettings;
  onSettingsChange: (settings: QuoteSettings, cursorPosition?: { start: number; end: number }) => void;
}

export interface FontOption {
  name: string;
  value: string;
  category?: string;
}

export interface KeyboardShortcut {
  id: string;
  label: string;
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  category: 'general' | 'text' | 'style' | 'effects' | 'export';
  description: string;
}

export interface ShortcutsContextType {
  shortcuts: KeyboardShortcut[];
  registerShortcut: (shortcut: KeyboardShortcut) => void;
  unregisterShortcut: (id: string) => void;
  showShortcutsModal: boolean;
  setShowShortcutsModal: (show: boolean) => void;
}

export interface SocialMediaPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  description: string;
  icon?: string;
}

export interface ExportOptions {
  format: 'png' | 'jpeg' | 'svg';
  width: number;
  height: number;
  quality?: number;
  transparent?: boolean;
  includeBackground?: boolean;
}