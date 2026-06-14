/**
 * One-line thesis per case, shown on the dark "curtain" when a case study is
 * opened (see TransitionCurtain). Each is condensed from that case's own deck —
 * no new claims. Wrap a single word/phrase in *asterisks* to tint it in accent.
 * Edit freely; a case with no entry here simply opens without a thesis curtain.
 */
export const taglines: Record<string, string> = {
  'up-insight': 'From scattered spreadsheets to one *source of truth*.',
  'crm-copilot': 'Fifteen clicks, or *one sentence*.',
  twilio: 'Teaching a US-only platform to feel *global*.',
  'tasktop-portability': 'Moving config changes between instances — without the *manual rework*.',
  'integration-landscape': 'An at-a-glance view of the whole *value stream*.',
  'tasktop-viz': 'A flow-metrics tool, built *from zero*.',
  'rackspace-servicenow': 'Redesigning new-hire onboarding around how people *actually work*.',
  'park-engagement': 'Where a city and its residents meet in the *park*.',
  ilab: 'A simpler way to match students to *lab projects*.',
  citportal: 'A home for *combinatorial-testing* research.',
  'pool-my-ride': 'Share the ride — and the *parking permit*.',
  techscene: 'Every tech event in Austin, in *one place*.',
  plotguru: "Real-time trivia for the shows you're *already watching*.",
  sketches: 'The slow craft that *balances out the screens*.',
};

/**
 * Shown on the same curtain when returning home from a case study, so the
 * leave-a-case transition mirrors the enter-a-case one. Site-level line (from
 * the homepage hero voice), not a per-case thesis. Edit freely; *asterisks*
 * tint a word in accent.
 */
export const homeTagline = 'Quiet, *useful* software.';
