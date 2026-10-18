import { LEGAL_DETAILS } from './legalDetails';

export type LegalSection = {
  heading: string;
  paragraphs: readonly string[];
};

export type LegalDocument = {
  title: string;
  intro: string;
  sections: readonly LegalSection[];
};

const { appName, operator, contactEmail, governingLaw, minimumAge } = LEGAL_DETAILS;

/**
 * Plain-language Privacy Policy. Every statement here describes what the app
 * actually does today; update it whenever data handling changes.
 */
export const PRIVACY_POLICY: LegalDocument = {
  title: 'Privacy Policy',
  intro: `${appName} is run by ${operator}. This policy explains what we collect, why, and the choices you have. The short version: we keep only what the app needs to work, we never sell your data, and we don’t run ads or tracking.`,
  sections: [
    {
      heading: 'What we collect',
      paragraphs: [
        'Account details: if you create an account, your email address, and either a password or your Sign in with Apple or Google sign-in. Passwords are handled by our sign-in provider and are never visible to us. With Sign in with Apple you can choose to hide your email; we then receive a private relay address from Apple.',
        'Profile: the username and display name you choose, your time zone, and when you finished setup.',
        'Your reset: your reset type, your current day, the days you checked in, your streak, and the setup answers that shape your plan (like your goals, how much time you give each day, and your reason for starting). These are backed up so your progress can be restored.',
        'Your journal: the entries you write, the mood you pick for each one, the day’s question, and when you saved them. These are backed up so they aren’t lost if you change phones.',
        'Your full setup answers and any unsaved journal drafts stay on your device.',
        'Friends: who you are friends with, requests you send or receive, and invite links you create.',
        'Kind words: the preset encouragements you send or receive, who sent them, and when.',
        'Notifications: if you turn on friend notifications, a notification address for your phone (a push token) so we can tell you when a friend sends kind words or a friend request. It’s removed when you turn them off, sign out, or delete your account. Daily reminders are scheduled on your phone and never sent through our servers.',
        'Purchases: if you subscribe, Apple handles payment. We receive only your subscription status through our purchase provider, never your card details.',
        'Crash reports: if the app crashes or hits an error, it sends a report with technical details (device model, iOS version, app version, and what went wrong) so we can fix it. Reports don’t include your journal, your email, or your name.',
      ],
    },
    {
      heading: 'What friends can see',
      paragraphs: [
        'Only people you accept as friends can see your username, your display name, your current day, whether you showed up today, and your streak.',
        'Friends can never see your journal, your setup answers, your reset details, or your email address.',
      ],
    },
    {
      heading: 'What we don’t do',
      paragraphs: [
        'We don’t sell or rent your personal information.',
        'We don’t show ads, and we don’t use analytics or tracking tools to follow you across apps or websites. Crash reports are used only to fix problems.',
        'We don’t access your contacts, location, photos, camera, or microphone.',
      ],
    },
    {
      heading: 'How we use your information',
      paragraphs: [
        'To run the app: signing you in, saving and restoring your progress and journal, showing your friends’ progress, delivering kind words, and sending the notifications you turn on.',
        'To manage your subscription and unlock Gently Reset Pro.',
        'To find and fix crashes and errors.',
        'To answer you when you contact us.',
      ],
    },
    {
      heading: 'Who helps us run the app',
      paragraphs: [
        'We use a small number of service providers that process data on our behalf: Supabase for accounts and backups, RevenueCat for subscription status, Sentry for crash reports, Expo for delivering notifications, Apple for payments, notifications, app delivery and Sign in with Apple, and Google for Sign in with Google. They may only use your information to provide their service to us.',
        'We may share information if the law requires it, or to protect the safety of our users.',
      ],
    },
    {
      heading: 'Keeping it and deleting it',
      paragraphs: [
        'We keep your information for as long as your account exists.',
        `You can delete your account and everything connected to it at any time in the app (You → Delete account), or by emailing ${contactEmail}. Information stored only on your device is removed when you delete the app.`,
        'Removing a friend stops them from seeing your progress straight away.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        `Depending on where you live, you may have the right to see, correct, export, or delete your information, or to object to how it is used. Email ${contactEmail} and we’ll help.`,
      ],
    },
    {
      heading: 'Security',
      paragraphs: [
        'Information is sent over encrypted connections and protected by access rules so only you, and the friends you choose, can see what’s yours. No system is perfectly secure, but we work to protect your information.',
      ],
    },
    {
      heading: 'Children',
      paragraphs: [
        `${appName} is not meant for anyone under ${minimumAge}, and we don’t knowingly collect information from children under ${minimumAge}. If you think a child has given us information, contact us and we’ll delete it.`,
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: [
        'If we change this policy, we’ll update the date at the top and, for important changes, let you know in the app.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [`Questions or requests: ${contactEmail}.`],
    },
  ],
};

/** Plain-language Terms of Service, including the terms Apple requires for App Store apps. */
export const TERMS_OF_SERVICE: LegalDocument = {
  title: 'Terms of Service',
  intro: `These terms are an agreement between you and ${operator} about using ${appName}. By using the app you agree to them. If you don’t agree, please don’t use the app.`,
  sections: [
    {
      heading: 'What Gently Reset is',
      paragraphs: [
        `${appName} is a self-improvement app that helps you build small daily habits and reflect on your days.`,
        'It is not medical, psychological, or professional advice, and it is not a substitute for care from a qualified professional. If you are struggling or in crisis, please contact local emergency services or a crisis line right away.',
      ],
    },
    {
      heading: 'Who can use it',
      paragraphs: [
        `You must be at least ${minimumAge} years old. If you’re under the age of adulthood where you live, you need a parent or guardian’s permission.`,
      ],
    },
    {
      heading: 'Your account',
      paragraphs: [
        'You’re responsible for keeping your login details safe and for what happens on your account. Give accurate information and let us know if you think someone else is using your account.',
      ],
    },
    {
      heading: 'Gently Reset Pro',
      paragraphs: [
        'Gently Reset Pro is an auto-renewing subscription. Payment is charged to your Apple ID when you confirm the purchase.',
        'Your subscription renews automatically at the same price and length unless you turn off auto-renew at least 24 hours before the end of the current period. You can manage or cancel it any time in your Apple ID settings.',
        'Refunds are handled by Apple under its policies. Deleting the app does not cancel a subscription.',
      ],
    },
    {
      heading: 'Being kind to others',
      paragraphs: [
        'Friends and kind words are for encouragement. Don’t use the app to harass, impersonate, or harm anyone, and don’t choose a username that is offensive or pretends to be someone else.',
        'Don’t try to break, reverse-engineer, overload, or get unauthorised access to the app or other people’s accounts.',
      ],
    },
    {
      heading: 'Your content',
      paragraphs: [
        'What you write in your journal belongs to you. You let us store and back it up only so we can provide the app to you. We don’t share it with your friends or anyone else, except as described in our Privacy Policy.',
      ],
    },
    {
      heading: 'Our content',
      paragraphs: [
        `The app, its mascot, artwork, text, and design belong to ${operator}. You may use the app for your own personal, non-commercial use, but you may not copy, sell, or redistribute it.`,
      ],
    },
    {
      heading: 'Ending things',
      paragraphs: [
        `You can stop using the app at any time and delete your account in the app (You → Delete account) or by emailing ${contactEmail}. We may suspend or end access for anyone who breaks these terms or misuses the app.`,
      ],
    },
    {
      heading: 'No guarantees',
      paragraphs: [
        'We work hard to keep the app running and your data safe, but the app is provided “as is”. We can’t promise it will always be available, error-free, or that it will lead to any particular result.',
      ],
    },
    {
      heading: 'Limits on our responsibility',
      paragraphs: [
        `To the extent the law allows, ${operator} is not responsible for indirect or consequential losses, and our total responsibility to you is limited to what you paid for the app in the last 12 months. Nothing here limits rights you have under consumer protection law that can’t be waived.`,
      ],
    },
    {
      heading: 'Apple',
      paragraphs: [
        `These terms are between you and ${operator}, not Apple. Apple is not responsible for the app or its content, has no obligation to provide maintenance or support, and is not responsible for any claims about the app. If the app fails to meet any warranty, you may notify Apple for a refund of the purchase price, and Apple has no other warranty obligation.`,
        `${operator}, not Apple, is responsible for handling any claim that the app infringes someone’s intellectual property. Apple and its subsidiaries are third-party beneficiaries of these terms and may enforce them. You confirm you are not in a country subject to a U.S. Government embargo and are not on any U.S. Government list of prohibited parties.`,
      ],
    },
    {
      heading: 'Changes to these terms',
      paragraphs: [
        'We may update these terms. We’ll change the date at the top, and for important changes we’ll let you know in the app. Using the app after a change means you accept the new terms.',
      ],
    },
    {
      heading: 'Governing law',
      paragraphs: [`These terms are governed by the laws of ${governingLaw}.`],
    },
    {
      heading: 'Contact',
      paragraphs: [`Questions about these terms: ${contactEmail}.`],
    },
  ],
};
