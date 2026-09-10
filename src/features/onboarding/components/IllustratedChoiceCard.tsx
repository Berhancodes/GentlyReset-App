import { ChoiceCard, type ChoiceCardProps } from '@/components/ui/ChoiceCard';

type IllustratedChoiceCardProps = Omit<ChoiceCardProps, 'variant' | 'showIndicator'>;

/** Page 2-style illustrated answer card. Keep this wrapper thin so reason stays identical. */
export function IllustratedChoiceCard(props: IllustratedChoiceCardProps) {
  return <ChoiceCard {...props} variant="illustrated" showIndicator={false} />;
}
