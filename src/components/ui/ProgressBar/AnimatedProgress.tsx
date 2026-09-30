import { ProgressBar, type ProgressBarProps } from '@/components/ui/ProgressBar/ProgressBar';
import { motion } from '@/design-system';

/**
 * Progress fill that interpolates to the next value.
 * Questionnaire chrome should keep this mounted so the bar does not remount per question.
 */
export function AnimatedProgress(props: Omit<ProgressBarProps, 'durationMs'>) {
  return <ProgressBar {...props} durationMs={motion.duration.progress} />;
}
