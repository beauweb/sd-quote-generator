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
}

export interface QuoteSettings extends QuoteTemplate {
  quoteText: string;
  signatureFontFamily?: string;
  textPath?: {
    enabled: boolean;
    radius: number;
    angle: number;
    direction: 'clockwise' | 'counterclockwise';
  };
}

export interface TextShadowEffect {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
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
  children: React.ReactNode;
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