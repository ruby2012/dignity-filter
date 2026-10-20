# Dignity Filter

A small, dependency-free TypeScript library that checks assistant text before it reaches a person, and keeps it **plain, adult, and respectful**.

AI assistants and apps often talk down to adults with intellectual and developmental disabilities: pet names ("sweetie"), praise meant for children ("good job, buddy"), flat prohibitions ("you can't do that"), and sentences that are too long to follow. Most teams never notice. Dignity Filter makes respectful language something you can test.

It was built for SafeGuide, a safety companion for adults with intellectual disabilities, during the Amazon Developer Hackathon (October 2026), and is published separately so any project can use it.

## What it does

`dignityFilter(text, reviewedFallback)` runs four checks:

1. **Removes pet names and child-directed praise.** "sweetie", "honey", "dear", "good boy", "good girl" are removed. "Good job" becomes "Thanks for checking."
2. **Reframes prohibitions.** "You can't" and "You're not allowed to" become "it's safer not to", which gives the same safety advice without taking away the person's choice.
3. **Screens readability.** Any sentence over 22 words, or above roughly grade 5.9 on an approximate Flesch-Kincaid score, fails.
4. **Screens tone.** Insulting or demeaning words ("stupid", "childish", "naughty", "incapable", and similar) and emoji fail.

If any check fails, the filter returns **your reviewed fallback text** instead of the original, and tells you why. It never tries to rewrite a failing sentence itself, so nothing unreviewed reaches the person.

## Install

Copy `src/index.ts` into your project, or add this repository as a dependency. It has no dependencies and runs anywhere TypeScript runs.

## Usage

```ts
import { dignityFilter, readingGrade } from "./index.ts";

dignityFilter("Good job, sweetie");
// { text: "Thanks for checking.", usedFallback: false, reasons: [] }

dignityFilter("You can't send money to people you met online.");
// { text: "it's safer not to send money to people you met online.", usedFallback: false, reasons: [] }

dignityFilter(
  "Exercise extraordinary circumspection regarding fraudulent solicitation.",
  "Be careful. This could be a scam."
);
// { text: "Be careful. This could be a scam.", usedFallback: true, reasons: ["reading-level"] }

readingGrade("Stop. Do not send money.");
// approximate grade level as a number
```

### API

- `dignityFilter(input: string, reviewedFallback?: string): FilterResult`
  - `text`: the filtered text, or `reviewedFallback` if any check failed
  - `usedFallback`: `true` when the fallback was used
  - `reasons`: which checks failed: `"reading-level"`, `"adult-tone"`, `"emoji"`
  - Default fallback: "Take your time. You can choose what to do next."
- `readingGrade(text: string): number`: an approximate Flesch-Kincaid grade for the text.

## Recommended pattern

Write a reviewed, plain-language fallback for every message your app might generate (especially AI-generated messages), and always pass it in. Then a failing sentence is replaced with words a person has checked, not with a guess.

## Tests

Requires Node 22.6 or later (for built-in TypeScript type stripping).

```sh
npm test
```

## Limits

- The readability score is a **screening heuristic**, not proof of grade level, accessibility, or clinical validation.
- The word lists are short and English-only. They catch common problems, not every one.
- Short reviewed sentences may score below grade 3. Don't add complexity to reach a minimum.
- **Test with adults from the community you serve** before relying on it. Their judgment is the real measure.

## Where it's used

SafeGuide, a voice safety companion for adults with intellectual disabilities, runs every person-facing sentence through Dignity Filter, including AI-written explanations, with reviewed fallback text for each safety category.

## Contributing

Issues and pull requests are welcome, especially more test cases written in plain language, word lists for other languages, and feedback from self-advocates and disability organizations.

## License

MIT. See [LICENSE](LICENSE).
