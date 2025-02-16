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
}

export interface QuoteSettings extends QuoteTemplate {
  quoteText: string;
  signatureFontFamily?: string;
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