import { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

import { motion } from '@/design-system';

export type TypewriterLine = {
  id: string;
  text: string;
};

function pauseForCharacter(character: string | undefined): number {
  if (character === '.' || character === '!' || character === '?' || character === '…') {
    return motion.typewriter.sentencePauseMs;
  }
  if (character === ',' || character === ';' || character === ':') {
    return motion.typewriter.commaPauseMs;
  }
  return motion.typewriter.charMs;
}

export function useStagedTypewriter(lines: readonly TypewriterLine[]) {
  const reduceMotion = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const line = lines[lineIndex];
    if (!line) {
      return;
    }

    if (charCount >= line.text.length) {
      if (lineIndex >= lines.length - 1) {
        return;
      }

      const pause = setTimeout(() => {
        setLineIndex((current) => current + 1);
        setCharCount(0);
      }, motion.typewriter.linePauseMs);

      return () => {
        clearTimeout(pause);
      };
    }

    const typedCharacter = line.text[charCount];
    const tick = setTimeout(() => {
      setCharCount((current) => current + 1);
    }, pauseForCharacter(typedCharacter));

    return () => {
      clearTimeout(tick);
    };
  }, [charCount, lineIndex, lines, reduceMotion]);

  const revealRemaining = useCallback(() => {
    const line = lines[lineIndex];
    if (!line) {
      return;
    }

    if (charCount < line.text.length) {
      setCharCount(line.text.length);
      return;
    }

    const lastIndex = Math.max(0, lines.length - 1);
    setLineIndex(lastIndex);
    setCharCount(lines[lastIndex]?.text.length ?? 0);
  }, [charCount, lineIndex, lines]);

  const visibleText = useCallback(
    (index: number) => {
      const line = lines[index];
      if (!line) {
        return '';
      }
      if (reduceMotion || index < lineIndex) {
        return line.text;
      }
      if (index > lineIndex) {
        return '';
      }
      return line.text.slice(0, charCount);
    },
    [charCount, lineIndex, lines, reduceMotion],
  );

  return {
    revealRemaining,
    visibleText,
  };
}
