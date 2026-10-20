/** Standalone module: no app imports, dependencies, or state. */
export type FilterResult = { text: string; usedFallback: boolean; reasons: string[] };
function syllables(word: string): number {
  const groups = word.toLowerCase().replace(/e$/, "").match(/[aeiouy]+/g);
  return Math.max(1, groups?.length ?? 1);
}
export function readingGrade(text: string): number {
  const words: string[] = text.match(/[a-z]+/gi) ?? [];
  if (!words.length) return 0;
  const sentences = Math.max(1, (text.match(/[.!?]+/g) ?? []).length);
  return 0.39 * (words.length / sentences) + 11.8 * (words.reduce((n, w) => n + syllables(w), 0) / words.length) - 15.59;
}
export function dignityFilter(input: string, reviewedFallback = "Take your time. You can choose what to do next."): FilterResult {
  let text = input.replace(/\b(sweetie|honey|dear|good boy|good girl)\b[,.!]?/gi, "")
    .replace(/\bGood job\b[,.!]?/gi, "Thanks for checking.")
    .replace(/\byou(?:'|’)re not allowed to\b/gi, "it's safer not to")
    .replace(/\byou (?:cannot|can't|can’t)\b/gi, "it's safer not to")
    .replace(/\s+([,.!?])/g, "$1").replace(/\s+/g, " ").trim();
  const reasons: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]?/g) ?? [];
  if (!text || sentences.some(s => (s.match(/\b[\w']+\b/g) ?? []).length > 22 || readingGrade(s) > 5.9)) reasons.push("reading-level");
  if (/\b(stupid|childish|obedient|naughty|incapable|idiot)\b/i.test(text)) reasons.push("adult-tone");
  if (/\p{Extended_Pictographic}/u.test(text)) reasons.push("emoji");
  if (reasons.length) text = reviewedFallback;
  return { text, usedFallback: reasons.length > 0, reasons };
}
