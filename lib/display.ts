/** Public-facing author label. Survey rows were seeded as "Survey respondent #N". */
export function publicDisplayName(
  displayName: string,
  source?: string | null,
): string {
  if (source === "survey") return "Anonymous";
  if (/^Survey respondent #\d+$/i.test(displayName)) return "Anonymous";
  return displayName;
}
