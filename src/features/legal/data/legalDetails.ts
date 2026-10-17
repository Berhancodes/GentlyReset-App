/**
 * The facts the Terms and Privacy Policy depend on. Fill these in before
 * shipping: they are placeholders until the owner provides real values, and
 * the documents should be reviewed by someone qualified for your region.
 */
export const LEGAL_DETAILS = {
  appName: 'Gently Reset',
  /** The person or company that runs the app. */
  operator: 'Gentlyreset',
  /** Where people send privacy requests, deletion requests and questions. */
  contactEmail: 'gentlyreset@gmail.com',
  /** Whose laws govern the Terms, e.g. "the Province of Alberta, Canada". */
  governingLaw: 'the Province of Alberta, Canada',
  /** Shown at the top of both documents. */
  lastUpdated: 'October 16, 2026',
  /** Youngest age allowed to use the app. */
  minimumAge: 13,
} as const;
