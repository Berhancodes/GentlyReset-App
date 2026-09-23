import { ChoiceCard, type ChoiceCardProps } from '@/components/ui/ChoiceCard';

type IllustratedChoiceCardProps = Omit<ChoiceCardProps, 'variant' | 'showIndicator'>;

/** Illustrated answer card used by the first question and later short visual grids. */
export function IllustratedChoiceCard(props: IllustratedChoiceCardProps) {
  return <ChoiceCard {...props} variant="illustrated" showIndicator={false} />;
}
