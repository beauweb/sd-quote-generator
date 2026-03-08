/**
 * Rich text parser - converts HTML from contenteditable to styled text segments
 * for canvas rendering.
 */

export interface TextSegment {
  text: string;
  bold: boolean;
  italic: boolean;
}

export interface RichTextRun {
  text: string;
  bold: boolean;
  italic: boolean;
}

export type RichWrappedLine = RichTextRun[];

/**
 * Parse HTML string into flat text segments with style information.
 * Handles <b>, <strong>, <i>, <em>, <br>, <div>, <p> tags.
 */
export function parseRichText(html: string): TextSegment[] {
  if (!html || html.trim() === '') {
    return [{ text: '', bold: false, italic: false }];
  }

  const div = document.createElement('div');
  div.innerHTML = html;

  const segments: TextSegment[] = [];

  function walk(node: Node, bold: boolean, italic: boolean) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text) {
        segments.push({ text, bold, italic });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      let newBold = bold;
      let newItalic = italic;

      if (tag === 'b' || tag === 'strong') newBold = true;
      if (tag === 'i' || tag === 'em') newItalic = true;

      if (tag === 'br') {
        segments.push({ text: '\n', bold: false, italic: false });
        return;
      }

      // Block elements create line breaks (except the very first one)
      if ((tag === 'div' || tag === 'p') && segments.length > 0) {
        const lastSeg = segments[segments.length - 1];
        if (lastSeg && !lastSeg.text.endsWith('\n')) {
          segments.push({ text: '\n', bold: false, italic: false });
        }
      }

      for (const child of Array.from(el.childNodes)) {
        walk(child, newBold, newItalic);
      }
    }
  }

  walk(div, false, false);
  return mergeSegments(segments);
}

/**
 * Merge adjacent segments with the same style
 */
function mergeSegments(segments: TextSegment[]): TextSegment[] {
  if (segments.length === 0) return [{ text: '', bold: false, italic: false }];

  const merged: TextSegment[] = [{ ...segments[0] }];
  for (let i = 1; i < segments.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = segments[i];
    if (prev.bold === curr.bold && prev.italic === curr.italic) {
      prev.text += curr.text;
    } else {
      merged.push({ ...curr });
    }
  }
  return merged;
}

/**
 * Get plain text from HTML string (strips all tags)
 */
export function getPlainTextFromHtml(html: string): string {
  const segments = parseRichText(html);
  return segments.map(s => s.text).join('');
}

/**
 * Wrap rich text into lines that fit within maxWidth.
 * Returns an array of lines, each containing styled text runs.
 */
export function wrapRichText(
  ctx: CanvasRenderingContext2D,
  html: string,
  maxWidth: number,
  fontFamily: string,
  fontSize: number,
  baseBold: boolean,
  baseItalic: boolean
): RichWrappedLine[] {
  const segments = parseRichText(html);

  // Split segments by newlines to get logical lines
  const logicalLines: TextSegment[][] = [[]];
  for (const seg of segments) {
    const parts = seg.text.split('\n');
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) logicalLines.push([]);
      if (parts[i]) {
        logicalLines[logicalLines.length - 1].push({
          text: parts[i],
          bold: seg.bold,
          italic: seg.italic,
        });
      }
    }
  }

  const result: RichWrappedLine[] = [];

  // Helper to measure text with a given style
  function measure(text: string, bold: boolean, italic: boolean): number {
    const eBold = baseBold || bold;
    const eItalic = baseItalic || italic;
    const fw = eBold ? 'bold' : 'normal';
    const fs = eItalic ? 'italic' : 'normal';
    ctx.font = `${fs} ${fw} ${fontSize}px ${fontFamily}`;
    return ctx.measureText(text).width;
  }

  const spaceWidth = measure(' ', false, false);

  for (const lineSegs of logicalLines) {
    if (lineSegs.length === 0) {
      result.push([]);
      continue;
    }

    // Build styled words from segments.
    // A "word" is text between spaces; one word can have multiple styled parts.
    interface StyledWord {
      parts: RichTextRun[];
      totalWidth: number;
    }

    const words: StyledWord[] = [];
    let currentParts: RichTextRun[] = [];

    for (const seg of lineSegs) {
      const text = seg.text;
      let start = 0;

      for (let i = 0; i <= text.length; i++) {
        if (i === text.length || text[i] === ' ') {
          if (i > start) {
            currentParts.push({
              text: text.substring(start, i),
              bold: seg.bold,
              italic: seg.italic,
            });
          }
          if (text[i] === ' ') {
            if (currentParts.length > 0) {
              let totalWidth = 0;
              for (const p of currentParts) {
                totalWidth += measure(p.text, p.bold, p.italic);
              }
              words.push({ parts: [...currentParts], totalWidth });
              currentParts = [];
            }
          }
          start = i + 1;
        }
      }
    }
    // Flush remaining parts as a word
    if (currentParts.length > 0) {
      let totalWidth = 0;
      for (const p of currentParts) {
        totalWidth += measure(p.text, p.bold, p.italic);
      }
      words.push({ parts: [...currentParts], totalWidth });
    }

    if (words.length === 0) {
      result.push([]);
      continue;
    }

    // Word-wrap
    let currentLine: RichTextRun[] = [];
    let currentLineWidth = 0;
    let isFirst = true;

    for (const word of words) {
      const neededWidth = isFirst ? word.totalWidth : spaceWidth + word.totalWidth;

      if (!isFirst && currentLineWidth + neededWidth > maxWidth) {
        result.push(currentLine);
        currentLine = [];
        currentLineWidth = 0;
        isFirst = true;
      }

      if (!isFirst) {
        currentLine.push({ text: ' ', bold: false, italic: false });
        currentLineWidth += spaceWidth;
      }

      for (const part of word.parts) {
        currentLine.push(part);
      }
      currentLineWidth += word.totalWidth;
      isFirst = false;
    }

    result.push(currentLine);
  }

  return result;
}
