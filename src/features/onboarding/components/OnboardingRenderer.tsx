import { BeforeAfterScreen } from '@/features/onboarding/screens/BeforeAfterScreen';
import { FinalScreen } from '@/features/onboarding/screens/FinalScreen';
import { LoadingScreen } from '@/features/onboarding/screens/LoadingScreen';
import { MultiChoiceScreen } from '@/features/onboarding/screens/MultiChoiceScreen';
import { PaywallScreen } from '@/features/onboarding/screens/PaywallScreen';
import { ResultDetailsScreen } from '@/features/onboarding/screens/ResultDetailsScreen';
import { ResultScreen } from '@/features/onboarding/screens/ResultScreen';
import { ScaleScreen } from '@/features/onboarding/screens/ScaleScreen';
import { SharePreviewScreen } from '@/features/onboarding/screens/SharePreviewScreen';
import { SingleChoiceScreen } from '@/features/onboarding/screens/SingleChoiceScreen';
import { StoryScreen } from '@/features/onboarding/screens/StoryScreen';
import { TextInputScreen } from '@/features/onboarding/screens/TextInputScreen';
import { WelcomeScreen } from '@/features/onboarding/screens/WelcomeScreen';
import type { OnboardingStep } from '@/features/onboarding/types/onboarding';
import { assertNever } from '@/utils/assertNever';

type OnboardingRendererProps = {
  step: OnboardingStep;
};

export function OnboardingRenderer({ step }: OnboardingRendererProps) {
  switch (step.type) {
    case 'welcome':
      return <WelcomeScreen step={step} />;
    case 'singleChoice':
      return <SingleChoiceScreen step={step} />;
    case 'multiChoice':
      return <MultiChoiceScreen step={step} />;
    case 'scale':
      return <ScaleScreen step={step} />;
    case 'textInput':
      return <TextInputScreen step={step} />;
    case 'story':
      return <StoryScreen step={step} />;
    case 'beforeAfter':
      return <BeforeAfterScreen step={step} />;
    case 'loading':
      return <LoadingScreen step={step} />;
    case 'result':
      return <ResultScreen step={step} />;
    case 'resultDetails':
      return <ResultDetailsScreen step={step} />;
    case 'sharePreview':
      return <SharePreviewScreen step={step} />;
    case 'final':
      return <FinalScreen step={step} />;
    case 'paywall':
      return <PaywallScreen step={step} />;
    default:
      return assertNever(step);
  }
}
