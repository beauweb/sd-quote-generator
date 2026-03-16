import { QuoteSettings, GradientEffect } from '../types';
import { getSmartContrastColor } from './colorUtils';
import { wrapRichText, RichWrappedLine, RichTextRun } from './richTextParser';

/**
 * Shared canvas rendering utilities for quote generation
 * Used by both QuoteCanvas component and export functionality
 */

export interface WrappedLine {
  text: string;
  words: string[];
}

/**
 * Wraps text to fit within a maximum width, preserving user line breaks
 */
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): WrappedLine[] {
  const userLines = text.split('\n');
  const allLines: WrappedLine[] = [];

  userLines.forEach(userLine => {
    if (userLine.trim() === '') {
      allLines.push({ text: '', words: [] });
    } else {
      const words = userLine.split(' ');
      let currentLine = words[0];
      let currentWords = [words[0]];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;

        if (width < maxWidth) {
          currentLine += " " + word;
          currentWords.push(word);
        } else {
          allLines.push({ text: currentLine, words: currentWords });
          currentLine = word;
          currentWords = [word];
        }
      }
      allLines.push({ text: currentLine, words: currentWords });
    }
  });

  return allLines;
}

/**
 * Draws background (solid color or gradient) on the canvas
 */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  settings: QuoteSettings,
  width: number,
  height: number
): void {
  if (settings.backgroundGradient) {
    let gradient;
    if (settings.backgroundGradient.type === 'linear') {
      const angle = settings.backgroundGradient.angle || 0;
      const radian = (angle - 90) * (Math.PI / 180);
      const length = Math.max(width, height) * 1.5;
      const centerX = width / 2;
      const centerY = height / 2;
      const startX = centerX - length / 2 * Math.cos(radian);
      const startY = centerY - length / 2 * Math.sin(radian);
      const endX = centerX + length / 2 * Math.cos(radian);
      const endY = centerY + length / 2 * Math.sin(radian);
      gradient = ctx.createLinearGradient(startX, startY, endX, endY);
    } else {
      gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, width / 2
      );
    }
    gradient.addColorStop(0, settings.backgroundGradient.colors[0]);
    gradient.addColorStop(1, settings.backgroundGradient.colors[1]);
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = settings.backgroundColor;
  }
  ctx.fillRect(0, 0, width, height);
}

/**
 * Draws pattern overlay (dots, lines, or waves)
 */
export function drawPattern(
  ctx: CanvasRenderingContext2D,
  pattern: 'dots' | 'lines' | 'waves',
  width: number,
  height: number,
  scaleFactor: number = 1
): void {
  ctx.globalAlpha = 0.1;
  const patternSize = Math.round(20 * scaleFactor);
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  ctx.lineWidth = Math.max(1, 1 * scaleFactor);

  switch (pattern) {
    case 'dots':
      for (let x = patternSize; x < width; x += patternSize * 2) {
        for (let y = patternSize; y < height; y += patternSize * 2) {
          ctx.beginPath();
          ctx.arc(x, y, Math.max(1, 1 * scaleFactor), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;

    case 'lines':
      for (let y = patternSize; y < height; y += patternSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      break;

    case 'waves':
      const amplitude = 5 * scaleFactor;
      const frequency = 0.02 / scaleFactor;
      for (let y = patternSize; y < height; y += patternSize * 2) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < width; x++) {
          ctx.lineTo(x, y + Math.sin(x * frequency) * amplitude);
        }
        ctx.stroke();
      }
      break;
  }
  ctx.globalAlpha = 1;
}



/**
 * Applies text gradient to the canvas context
 */
export function applyTextGradient(
  ctx: CanvasRenderingContext2D,
  gradientSettings: GradientEffect,
  width: number,
  height: number
): void {
  if (!gradientSettings.enabled) return;

  let gradient;
  if (gradientSettings.type === 'linear') {
    const angle = gradientSettings.angle || 0;
    const radian = (angle - 90) * (Math.PI / 180);
    const length = Math.sqrt(width * width + height * height);
    const centerX = width / 2;
    const centerY = height / 2;
    const startX = centerX - length / 2 * Math.cos(radian);
    const startY = centerY - length / 2 * Math.sin(radian);
    const endX = centerX + length / 2 * Math.cos(radian);
    const endY = centerY + length / 2 * Math.sin(radian);

    gradient = ctx.createLinearGradient(startX, startY, endX, endY);
  } else {
    gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, width / 2
    );
  }

  if (gradientSettings.colors.length >= 2) {
    gradient.addColorStop(0, gradientSettings.colors[0]);
    gradient.addColorStop(1, gradientSettings.colors[1]);
  } else if (gradientSettings.colors.length === 1) {
    gradient.addColorStop(0, gradientSettings.colors[0]);
    gradient.addColorStop(1, '#ffffff');
  }

  ctx.fillStyle = gradient;
}

/**
 * Draws a gradient on the canvas
 */
export function drawGradient(
  ctx: CanvasRenderingContext2D,
  gradientSettings: GradientEffect,
  width: number,
  height: number
): void {
  if (!gradientSettings.enabled) return;

  let gradient;
  if (gradientSettings.type === 'linear') {
    const angle = gradientSettings.angle || 0;
    const radian = (angle - 90) * (Math.PI / 180);
    const length = Math.sqrt(width * width + height * height);
    const centerX = width / 2;
    const centerY = height / 2;
    const startX = centerX - length / 2 * Math.cos(radian);
    const startY = centerY - length / 2 * Math.sin(radian);
    const endX = centerX + length / 2 * Math.cos(radian);
    const endY = centerY + length / 2 * Math.sin(radian);

    gradient = ctx.createLinearGradient(startX, startY, endX, endY);
  } else {
    gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, width / 2
    );
  }

  if (gradientSettings.colors.length >= 2) {
    gradient.addColorStop(0, gradientSettings.colors[0]);
    gradient.addColorStop(1, gradientSettings.colors[1]);
  } else if (gradientSettings.colors.length === 1) {
    gradient.addColorStop(0, gradientSettings.colors[0]);
    gradient.addColorStop(1, '#ffffff');
  }

  ctx.fillStyle = gradient;
}

/**
 * Applies text shadow settings to the canvas context
 */
export function applyTextShadow(
  ctx: CanvasRenderingContext2D,
  settings: QuoteSettings,
  scaleFactor: number = 1
): void {
  if (settings.textShadow && settings.textShadow.enabled) {
    ctx.shadowColor = settings.textShadow.color;
    ctx.shadowBlur = Math.round(settings.textShadow.blur * scaleFactor);
    ctx.shadowOffsetX = Math.round(settings.textShadow.offsetX * scaleFactor);
    ctx.shadowOffsetY = Math.round(settings.textShadow.offsetY * scaleFactor);
  } else {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
}

/**
 * Applies subtle default shadow for better readability
 */
export function applyDefaultShadow(
  ctx: CanvasRenderingContext2D,
  scaleFactor: number = 1
): void {
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = Math.round(2 * scaleFactor);
  ctx.shadowOffsetX = Math.round(1 * scaleFactor);
  ctx.shadowOffsetY = Math.round(1 * scaleFactor);
}

/**
 * Applies text outline settings to the canvas context
 */
export function applyTextOutline(
  ctx: CanvasRenderingContext2D,
  settings: QuoteSettings,
  scaleFactor: number = 1
): void {
  if (settings.textOutline && settings.textOutline.enabled) {
    ctx.lineWidth = Math.max(1, Math.round(settings.textOutline.width * scaleFactor));
    ctx.strokeStyle = settings.textOutline.color;
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
  }
}

/**
 * Gets the X position for text based on alignment
 */
export function getTextX(
  alignment: 'left' | 'center' | 'right' | 'justify',
  width: number,
  padding: number
): number {
  switch (alignment) {
    case 'left':
      return padding;
    case 'right':
      return width - padding;
    default:
      return width / 2;
  }
}

/**
 * Draws text with outline (if enabled) and fill
 */
export function drawTextWithEffects(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  settings: QuoteSettings,
  hasOutline: boolean = true
): void {
  if (hasOutline && settings.textOutline && settings.textOutline.enabled) {
    ctx.strokeText(text, x, y);
  }
  ctx.fillText(text, x, y);
}

/**
 * Draws the title text
 */
export function drawTitle(
  ctx: CanvasRenderingContext2D,
  titleLines: WrappedLine[],
  settings: QuoteSettings,
  width: number,
  padding: number,
  titleY: number,
  titleFontSize: number,
  titleLineHeight: number,
  scaleFactor: number = 1
): number {
  if (titleLines.length === 0) return titleY;

  ctx.save();

  let fontStyle = '';
  if (settings.textStyle.italic) fontStyle += 'italic ';
  if (settings.textStyle.bold) fontStyle += 'bold ';

  ctx.font = `${fontStyle}${titleFontSize}px ${settings.titleFontFamily || settings.fontFamily}`;
  ctx.fillStyle = settings.textColor;
  ctx.textAlign = settings.textAlignment as CanvasTextAlign;

  if (settings.textShadow && settings.textShadow.enabled) {
    applyTextShadow(ctx, settings, scaleFactor);
  } else {
    applyDefaultShadow(ctx, scaleFactor);
  }

  applyTextOutline(ctx, settings, scaleFactor);

  let currentY = titleY;
  titleLines.forEach(line => {
    const x = getTextX(settings.textAlignment, width, padding);
    drawTextWithEffects(ctx, line.text, x, currentY, settings);
    currentY += titleLineHeight;
  });

  ctx.restore();
  return currentY;
}

/**
 * Draws the quote text with support for justified alignment
 */
export function drawQuoteText(
  ctx: CanvasRenderingContext2D,
  quoteLines: WrappedLine[],
  settings: QuoteSettings,
  width: number,
  padding: number,
  startY: number,
  lineHeight: number,
  maxWidth: number
): number {
  let y = startY;

  quoteLines.forEach(line => {
    if (settings.textAlignment === 'justify' && line.words.length > 1) {
      const totalSpacing = maxWidth - ctx.measureText(line.text.replace(/\s/g, '')).width;
      const spaceBetween = totalSpacing / (line.words.length - 1);

      let x = padding;
      line.words.forEach(() => {
        if (settings.textOutline && settings.textOutline.enabled) {
          ctx.strokeText(line.text, x, y);
        }
        ctx.fillText(line.text, x, y);
        x += ctx.measureText(line.text).width + spaceBetween;
      });
    } else {
      const x = getTextX(settings.textAlignment, width, padding);

      if (settings.textOutline && settings.textOutline.enabled) {
        ctx.strokeText(line.text, x, y);
      }
      ctx.fillText(line.text, x, y);
    }
    y += lineHeight;
  });

  return y;
}

/**
 * Draws rich text (with inline bold/italic) for the quote.
 * Each line is an array of styled runs rendered left-to-right.
 */
export function drawRichQuoteText(
  ctx: CanvasRenderingContext2D,
  lines: RichWrappedLine[],
  settings: QuoteSettings,
  width: number,
  padding: number,
  startY: number,
  lineHeight: number,
  fontSize: number,
  scaleFactor: number = 1
): number {
  let y = startY;
  const baseBold = settings.textStyle.bold;
  const baseItalic = settings.textStyle.italic;

  // Helper to build a CSS font string for a run
  function fontFor(run: RichTextRun): string {
    const eBold = baseBold || run.bold;
    const eItalic = baseItalic || run.italic;
    const fw = eBold ? 'bold' : 'normal';
    const fs = eItalic ? 'italic' : 'normal';
    return `${fs} ${fw} ${fontSize}px ${settings.fontFamily}`;
  }

  for (const line of lines) {
    if (line.length === 0) {
      y += lineHeight;
      continue;
    }

    // Measure total line width for alignment
    let totalWidth = 0;
    const measured = line.map(run => {
      ctx.font = fontFor(run);
      const w = ctx.measureText(run.text).width;
      totalWidth += w;
      return { ...run, width: w };
    });

    // Calculate starting x from alignment
    let x: number;
    switch (settings.textAlignment) {
      case 'left':
        x = padding;
        break;
      case 'right':
        x = width - padding - totalWidth;
        break;
      case 'justify':
      case 'center':
      default:
        x = (width - totalWidth) / 2;
        break;
    }

    // Save context, set textAlign to 'left' for manual positioning
    ctx.save();
    ctx.textAlign = 'left';

    // Apply text effects (shadow, outline)
    if (settings.textShadow && settings.textShadow.enabled) {
      applyTextShadow(ctx, settings, scaleFactor);
    }
    if (settings.textOutline && settings.textOutline.enabled) {
      applyTextOutline(ctx, settings, scaleFactor);
    }

    // Apply text color/gradient
    if (settings.textGradient && settings.textGradient.enabled) {
      applyTextGradient(ctx, settings.textGradient, width, width);
    } else {
      ctx.fillStyle = settings.textColor;
    }

    for (const run of measured) {
      ctx.font = fontFor(run);
      if (settings.textOutline && settings.textOutline.enabled) {
        ctx.strokeText(run.text, x, y);
      }
      ctx.fillText(run.text, x, y);
      x += run.width;
    }

    ctx.restore();
    y += lineHeight;
  }

  return y;
}

/**
 * Draws the signature text
 */
export function drawSignature(
  ctx: CanvasRenderingContext2D,
  settings: QuoteSettings,
  width: number,
  height: number,
  padding: number,
  signatureSize: number,
  scaleFactor: number = 1
): void {
  if (!settings.signatureVisible || !settings.signatureText.trim()) return;

  const bottomMargin = Math.round((settings.signatureBottomMargin || 100) * scaleFactor);

  let fontStyle = '';
  if (settings.textStyle.italic) fontStyle += 'italic ';
  if (settings.textStyle.bold) fontStyle += 'bold ';

  ctx.font = `${fontStyle}${signatureSize}px ${settings.signatureFontFamily || settings.fontFamily}`;

  const backgroundColor = settings.backgroundGradient
    ? settings.backgroundGradient.colors[0]
    : settings.backgroundColor;
  ctx.fillStyle = getSmartContrastColor(backgroundColor);

  ctx.textAlign = settings.signatureAlignment as CanvasTextAlign;

  if (settings.textShadow && settings.textShadow.enabled) {
    applyTextShadow(ctx, settings, scaleFactor);
  } else {
    applyDefaultShadow(ctx, scaleFactor);
  }

  applyTextOutline(ctx, settings, scaleFactor);

  const signatureX = getTextX(settings.signatureAlignment, width, padding);
  const signatureY = Math.round(height - bottomMargin);

  drawTextWithEffects(ctx, settings.signatureText, signatureX, signatureY, settings);
}

/**
 * Draws curved text along a circular path
 */
export function drawCurvedText(
  ctx: CanvasRenderingContext2D,
  settings: QuoteSettings,
  width: number,
  height: number,
  lines: WrappedLine[]
): void {
  if (!settings.textPath || !settings.textPath.enabled) return;

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = settings.textPath.radius * (width / 1080);
  const direction = settings.textPath.direction === 'clockwise' ? 1 : -1;
  const baseAngle = (settings.textPath.angle * Math.PI) / 180;

  const totalTextLength = lines.reduce((acc, line) => acc + line.text.length, 0);
  const anglePerChar = (Math.PI / 2) / (totalTextLength * 0.8);

  let currentAngle = baseAngle - (direction * (lines[0].text.length * anglePerChar) / 2);

  lines.forEach(line => {
    const chars = Array.from(line.text);

    chars.forEach(char => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(currentAngle);
      ctx.translate(0, -radius);
      ctx.rotate(Math.PI / 2);

      if (settings.textOutline && settings.textOutline.enabled) {
        ctx.strokeText(char, 0, 0);
      }
      ctx.fillText(char, 0, 0);

      ctx.restore();
      currentAngle += direction * anglePerChar;
    });

    currentAngle += direction * anglePerChar * 3;
  });
}

/**
 * Preloads fonts for canvas rendering
 */
export async function preloadFonts(
  settings: QuoteSettings,
  fontSize: number,
  signatureSize: number
): Promise<void> {
  const fontWeight = settings.textStyle.bold ? 'bold' : 'normal';
  const fontStyle = settings.textStyle.italic ? 'italic' : 'normal';

  await Promise.all([
    document.fonts.load(`${fontStyle} ${fontWeight} ${fontSize}px ${settings.fontFamily}`),
    document.fonts.load(`${signatureSize}px ${settings.signatureFontFamily || settings.fontFamily}`)
  ]).catch(e => {
    console.warn('Font loading warning:', e);
  });
}

/**
 * Main render function - renders the complete quote to a canvas
 */
export function renderQuoteToCanvas(
  ctx: CanvasRenderingContext2D,
  settings: QuoteSettings,
  canvasSize: number,
  scaleFactor: number = 1
): void {
  const width = canvasSize;
  const height = canvasSize;

  // Disable image smoothing for sharper text
  ctx.imageSmoothingEnabled = false;

  // Clear the canvas totally first (to ensure transparency behind clippings)
  ctx.clearRect(0, 0, width, height);



  // Draw background
  drawBackground(ctx, settings, width, height);

  // Draw pattern overlay
  if (settings.pattern) {
    drawPattern(ctx, settings.pattern, width, height, scaleFactor);
  }



  // Calculate dimensions
  const fontSize = Math.round(settings.fontSize * scaleFactor);
  const padding = Math.round(settings.padding * scaleFactor);
  const lineHeight = fontSize * (settings.lineHeight || 1.2);
  const titleFontSize = Math.round(fontSize * 0.9);
  const titleLineHeight = titleFontSize * (settings.lineHeight || 1.2);
  const signatureSize = Math.round(settings.signatureSize * scaleFactor);

  // Set font
  const fontWeight = settings.textStyle.bold ? 'bold' : 'normal';
  const fontStyle = settings.textStyle.italic ? 'italic' : 'normal';
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${settings.fontFamily}`;

  // Apply text color/gradient
  if (settings.textGradient && settings.textGradient.enabled) {
    applyTextGradient(ctx, settings.textGradient, width, height);
  } else {
    ctx.fillStyle = settings.textColor;
  }

  ctx.textAlign = settings.textAlignment as CanvasTextAlign;

  // Apply text effects
  applyTextShadow(ctx, settings, scaleFactor);
  applyTextOutline(ctx, settings, scaleFactor);

  // Wrap text
  const maxWidth = width - (padding * 2);
  const titleLines = (settings.title && settings.titleVisible !== false) ? wrapText(ctx, settings.title, maxWidth) : [];

  // Use rich text wrapping for the quote (supports inline bold/italic/emoji)
  const richQuoteLines = wrapRichText(
    ctx,
    settings.quoteText,
    maxWidth,
    settings.fontFamily,
    fontSize,
    settings.textStyle.bold,
    settings.textStyle.italic
  );

  // Calculate total content height
  const totalContentHeight = (titleLines.length * titleLineHeight) + (richQuoteLines.length * lineHeight);

  // Draw title (only if visible)
  let titleY = (height - totalContentHeight) / 2;
  if (settings.titleVisible !== false) {
    titleY = drawTitle(
      ctx, titleLines, settings, width, padding, titleY, titleFontSize, titleLineHeight, scaleFactor
    );
  }

  // Calculate quote starting position
  let y = titleLines.length > 0
    ? titleY + (titleLineHeight * 1.2)
    : (height - (richQuoteLines.length * lineHeight)) / 2;

  // Draw quote text (normal or curved)
  if (settings.textPath && settings.textPath.enabled) {
    // For curved text, fall back to plain text rendering
    const quoteLines = wrapText(ctx, settings.quoteText.replace(/<[^>]+>/g, ''), maxWidth);
    drawCurvedText(ctx, settings, width, height, quoteLines);
  } else {
    drawRichQuoteText(ctx, richQuoteLines, settings, width, padding, y, lineHeight, fontSize, scaleFactor);
  }

  // Draw signature
  drawSignature(ctx, settings, width, height, padding, signatureSize, scaleFactor);
}
