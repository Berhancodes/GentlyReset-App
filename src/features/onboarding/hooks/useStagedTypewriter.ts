import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

import { motion } from '@/design-system';

export type TypewriterLine = {
  id: string;
  text: string;
};

type TypedSnapshot = {
  lineIndex: number;
  charCount: number;
};

function charactersOf(text: string): readonly string[] {
  return [...text];
}

function durationForCharacter(character: string): number {
  if (character === ' ' || character === '\n') {
    return Math.round(motion.typewriter.charMs * 0.55);
  }
  if (character === '.' || character === '!' || character === '?' || character === '…') {
    return motion.typewriter.sentencePauseMs;
  }
  if (character === ',' || character === ';' || character === ':') {
    return motion.typewriter.commaPauseMs;
  }
  return motion.typewriter.charMs;
}

function buildLineTimings(lines: readonly TypewriterLine[]): readonly (readonly number[])[] {
  return lines.map((line) => {
    const appearAt: number[] = [];
    let elapsed = 0;

    for (const character of charactersOf(line.text)) {
      elapsed += durationForCharacter(character);
      appearAt.push(elapsed);
    }

    return appearAt;
  });
}

export function getTypewriterDuration(lines: readonly TypewriterLine[]): number {
  const timings = buildLineTimings(lines);
  let total = 0;

  for (let lineIndex = 0; lineIndex < timings.length; lineIndex += 1) {
    const appearAt = timings[lineIndex];
    total += appearAt?.[appearAt.length - 1] ?? 0;
    if (lineIndex < timings.length - 1) {
      total += motion.typewriter.linePauseMs;
    }
  }

  return total;
}

function snapshotAt(
  lines: readonly TypewriterLine[],
  timings: readonly (readonly number[])[],
  elapsed: number,
): TypedSnapshot {
  let consumed = 0;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const appearAt = timings[lineIndex];
    if (!line || !appearAt) {
      continue;
    }

    const lineDuration = appearAt[appearAt.length - 1] ?? 0;
    if (elapsed < consumed + lineDuration) {
      const local = elapsed - consumed;
      let charCount = 0;
      for (const at of appearAt) {
        if (at <= local) {
          charCount += 1;
        } else {
          break;
        }
      }
      return { lineIndex, charCount };
    }

    consumed += lineDuration;
    if (lineIndex < lines.length - 1) {
      consumed += motion.typewriter.linePauseMs;
      if (elapsed < consumed) {
        return { lineIndex, charCount: line.text.length };
      }
    }
  }

  const lastIndex = Math.max(0, lines.length - 1);
  return {
    lineIndex: lastIndex,
    charCount: charactersOf(lines[lastIndex]?.text ?? '').length,
  };
}

function isSnapshotComplete(lines: readonly TypewriterLine[], snapshot: TypedSnapshot): boolean {
  const lastLine = lines[lines.length - 1];
  return (
    snapshot.lineIndex >= lines.length - 1 &&
    snapshot.charCount >= charactersOf(lastLine?.text ?? '').length
  );
}

function nowMs(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

export function useStagedTypewriter(lines: readonly TypewriterLine[]) {
  const reduceMotion = useReducedMotion();
  const timings = useMemo(() => buildLineTimings(lines), [lines]);
  const [snapshot, setSnapshot] = useState<TypedSnapshot>({ lineIndex: 0, charCount: 0 });
  const elapsedRef = useRef(0);
  const startedAtRef = useRef(0);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    startedAtRef.current = nowMs() - elapsedRef.current;
    let frameId = 0;

    const tick = (frameTime: number) => {
      const elapsed = frameTime - startedAtRef.current;
      elapsedRef.current = elapsed;
      const next = snapshotAt(lines, timings, elapsed);

      setSnapshot((current) =>
        current.lineIndex === next.lineIndex && current.charCount === next.charCount
          ? current
          : next,
      );

      const finished = isSnapshotComplete(lines, next);

      if (!finished) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [lines, reduceMotion, timings]);

  const revealRemaining = useCallback(() => {
    const line = lines[snapshot.lineIndex];
    const appearAt = timings[snapshot.lineIndex];
    if (!line || !appearAt) {
      return;
    }

    let targetElapsed = 0;
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const lineTimes = timings[lineIndex];
      const duration = lineTimes?.[lineTimes.length - 1] ?? 0;
      if (lineIndex < snapshot.lineIndex) {
        targetElapsed += duration + motion.typewriter.linePauseMs;
        continue;
      }

      if (snapshot.charCount < charactersOf(line.text).length) {
        targetElapsed += duration;
      } else {
        for (let remaining = lineIndex; remaining < lines.length; remaining += 1) {
          const remainingTimes = timings[remaining];
          targetElapsed += remainingTimes?.[remainingTimes.length - 1] ?? 0;
          if (remaining < lines.length - 1) {
            targetElapsed += motion.typewriter.linePauseMs;
          }
        }
      }
      break;
    }

    elapsedRef.current = targetElapsed;
    startedAtRef.current = nowMs() - targetElapsed;
    setSnapshot(snapshotAt(lines, timings, targetElapsed));
  }, [lines, snapshot.charCount, snapshot.lineIndex, timings]);

  const visibleText = useCallback(
    (index: number) => {
      const line = lines[index];
      if (!line) {
        return '';
      }
      if (reduceMotion || index < snapshot.lineIndex) {
        return line.text;
      }
      if (index > snapshot.lineIndex) {
        return '';
      }
      return charactersOf(line.text).slice(0, snapshot.charCount).join('');
    },
    [lines, reduceMotion, snapshot.charCount, snapshot.lineIndex],
  );

  const isLineActive = useCallback(
    (index: number) => {
      if (reduceMotion) {
        return true;
      }
      return index < snapshot.lineIndex || (index === snapshot.lineIndex && snapshot.charCount > 0);
    },
    [reduceMotion, snapshot.charCount, snapshot.lineIndex],
  );

  return {
    isComplete: reduceMotion || isSnapshotComplete(lines, snapshot),
    isLineActive,
    revealRemaining,
    visibleText,
  };
}
