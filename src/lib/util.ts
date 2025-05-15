// Helper to detect bots via user-agent
export function isBot(userAgent: string | undefined): boolean {
  if (!userAgent) return true; // treat missing UA as bot
  const botPattern =
    /bot|crawl|spider|slurp|facebookexternalhit|facebot|ia_archiver/i;
  return botPattern.test(userAgent);
}
