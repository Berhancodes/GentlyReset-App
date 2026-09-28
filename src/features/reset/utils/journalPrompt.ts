import type { ResetPersonalization } from '@/features/reset/types';
import { getTaskReflectionPrompt } from '../../../domain/reset/roadmap';

const PROMPT_BY_FEELING: Record<string, string> = {
  calm: 'what helped your mind feel even a little quieter?',
  confident: 'where did you trust yourself today, even slightly?',
  motivated: 'what small move still counted?',
  proud: 'what could you be quietly proud of from today?',
  energized: 'what gave you a bit of energy back?',
  present: 'when were you actually here, even for a moment?',
  hopeful: 'what felt one percent more possible?',
  'in-control': 'what did you choose on purpose today?',
};

export function getJournalPrompt(
  taskTitle: string,
  personalization: ResetPersonalization,
  resetTypeId?: string,
  day?: number,
): string {
  if (resetTypeId && day !== undefined) {
    return getTaskReflectionPrompt(day, personalization, resetTypeId);
  }

  const feeling = personalization.desiredFeelings[0];
  if (feeling && PROMPT_BY_FEELING[feeling]) {
    return PROMPT_BY_FEELING[feeling];
  }

  if (personalization.supportStyle === 'be-gentle') {
    return 'what felt even a little kinder today?';
  }

  if (personalization.primaryObstacle === 'too-much') {
    return 'what did you let stay small today?';
  }

  return `how did “${taskTitle}” feel?`;
}
