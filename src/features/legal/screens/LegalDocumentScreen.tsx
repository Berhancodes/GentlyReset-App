import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/ui';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  radius,
  spacing,
  textVariants,
} from '@/design-system';
import { LEGAL_DETAILS } from '@/features/legal/data/legalDetails';
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from '@/features/legal/data/legalDocuments';
import type { LegalDocumentKind } from '@/features/legal/utils/openLegalDocument';
import { BackChevron } from '@/features/onboarding/components/BackChevron';
import { StageBackdrop } from '@/features/onboarding/stage/StageBackdrop';

const DOCUMENTS = { terms: TERMS_OF_SERVICE, privacy: PRIVACY_POLICY } as const;

/** The Terms of Service or Privacy Policy, readable in the app's own style. */
export function LegalDocumentScreen({ kind }: { kind: LegalDocumentKind }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const document = DOCUMENTS[kind];

  return (
    <Screen
      includeTopSafeArea={false}
      includeBottomSafeArea={false}
      padded={false}
      backgroundColor={colors.stage.floor}
    >
      <StageBackdrop />
      <View style={[styles.nav, { paddingTop: insets.top + spacing.xxs }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
              return;
            }
            router.replace('/');
          }}
          style={styles.navButton}
        >
          <View style={styles.backCircle}>
            <BackChevron />
          </View>
        </Pressable>
        <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
          {LEGAL_DETAILS.appName}
        </Text>
        <View style={styles.navButton} />
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <Text style={styles.title} accessibilityRole="header" maxFontSizeMultiplier={1.25}>
            {document.title}
          </Text>
          <Text style={styles.updated} maxFontSizeMultiplier={1.3}>
            {`Last updated ${LEGAL_DETAILS.lastUpdated}`}
          </Text>
        </View>
        <Text style={styles.intro} maxFontSizeMultiplier={1.4}>
          {document.intro}
        </Text>
        {document.sections.map((section) => (
          <View key={section.heading} style={styles.section}>
            <Text style={styles.heading} accessibilityRole="header" maxFontSizeMultiplier={1.3}>
              {section.heading}
            </Text>
            {section.paragraphs.map((paragraph) => (
              <Text key={paragraph} style={styles.paragraph} maxFontSizeMultiplier={1.4}>
                {paragraph}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  navButton: {
    width: spacing.hitTarget,
    height: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backCircle: {
    width: spacing.xl + 2,
    height: spacing.xl + 2,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.stage.chip,
  },
  eyebrow: {
    ...textVariants.stageEyebrow,
    color: colors.stage.copySoft,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  head: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  title: {
    ...textVariants.stageTitle,
    color: colors.text.primary,
    textAlign: 'center',
  },
  updated: {
    ...textVariants.stageSubtitle,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  intro: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  section: {
    gap: spacing.xs,
  },
  heading: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
  },
  paragraph: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm + 2,
    fontWeight: fontWeights.semibold,
    color: colors.stage.copySoft,
  },
});
