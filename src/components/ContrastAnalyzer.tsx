import React from 'react';
import {
  getContrastRatio,
  getAccessibilityLevel,
  getSuggestedAccessibleColors
} from '../utils/colorContrast';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ContrastAnalyzerProps {
  foregroundColor: string;
  backgroundColor: string;
  fontSize: number;
  isBold: boolean;
  onApplySuggestion: (suggestedForeground: string, suggestedBackground: string) => void;
}

const ContrastAnalyzer: React.FC<ContrastAnalyzerProps> = ({
  foregroundColor,
  backgroundColor,
  fontSize,
  isBold,
  onApplySuggestion
}) => {
  // Determine if text is considered "large" by WCAG standards
  // Large text is 14pt bold or 18pt (or larger) regular
  const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && isBold);
  
  // Calculate contrast ratio
  const ratio = getContrastRatio(foregroundColor, backgroundColor);
  const formattedRatio = ratio.toFixed(2);
  
  // Get accessibility level
  const level = getAccessibilityLevel(foregroundColor, backgroundColor, isLargeText);

  // Get suggested colors for better contrast
  const { suggestedForeground, suggestedBackground } = getSuggestedAccessibleColors(
    foregroundColor,
    backgroundColor
  );

  // Determine if a suggestion is different from current colors
  const hasForegroundSuggestion = suggestedForeground !== foregroundColor;
  const hasBackgroundSuggestion = suggestedBackground !== backgroundColor;
  const hasSuggestion = hasForegroundSuggestion || hasBackgroundSuggestion;
  
  // Render icon based on accessibility level
  const renderIcon = () => {
    switch (level) {
      case 'AAA':
        return <CheckCircle size={24} className="text-green-500" />;
      case 'AA':
        return <CheckCircle size={24} className="text-green-400" />;
      case 'fail':
        return <AlertTriangle size={24} className="text-yellow-500" />;
      default:
        return <Info size={24} className="text-blue-500" />;
    }
  };

  return (
    <div className="bg-dark-800 rounded-lg p-4 mt-4 border border-dark-700">
      <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
        {renderIcon()}
        <span>Contrast Analysis</span>
      </h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300">Contrast Ratio:</span>
          <span className="font-mono text-white">{formattedRatio}:1</span>
        </div>
        
        <div className="w-full bg-dark-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              ratio >= 7 
                ? 'bg-green-500' 
                : ratio >= 4.5 
                  ? 'bg-green-400' 
                  : ratio >= 3 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(100, (ratio / 21) * 100)}%` }}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300">WCAG Compliance:</span>
          <span className={`font-semibold ${
            level === 'AAA' 
              ? 'text-green-500' 
              : level === 'AA' 
                ? 'text-green-400'
                : 'text-yellow-500'
          }`}>
            {level === 'AAA' 
              ? 'AAA (Excellent)' 
              : level === 'AA' 
                ? 'AA (Good)' 
                : 'Fails Guidelines'}
          </span>
        </div>
        
        <div className="text-xs text-gray-400 mt-1">
          {isLargeText 
            ? 'Large text (18pt+ or 14pt+ bold) requires 3:1 for AA, 4.5:1 for AAA'
            : 'Normal text requires 4.5:1 for AA, 7:1 for AAA'}
        </div>
      </div>
      
      {level === 'fail' && hasSuggestion && (
        <div className="mt-4">
          <div className="p-3 bg-dark-700 rounded border border-yellow-500/30">
            <h4 className="text-white flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-yellow-500" />
              <span>Contrast Issue Detected</span>
            </h4>
            <p className="text-gray-300 text-sm mb-3">
              Your current color combination doesn't meet WCAG accessibility guidelines. 
              This may make your text difficult to read for some users.
            </p>
            
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Before</span>
                <span>Contrast: {formattedRatio}:1</span>
              </div>
              <div 
                className="h-10 rounded flex items-center justify-center"
                style={{ backgroundColor, color: foregroundColor }}
              >
                <span className="font-medium">Sample Text</span>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Suggested</span>
                <span>Contrast: {getContrastRatio(suggestedForeground, suggestedBackground).toFixed(2)}:1</span>
              </div>
              <div 
                className="h-10 rounded flex items-center justify-center"
                style={{ backgroundColor: suggestedBackground, color: suggestedForeground }}
              >
                <span className="font-medium">Sample Text</span>
              </div>
            </div>
            
            <button
              onClick={() => onApplySuggestion(suggestedForeground, suggestedBackground)}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-2 px-4 rounded transition-colors"
            >
              Apply Suggested Colors
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContrastAnalyzer; 