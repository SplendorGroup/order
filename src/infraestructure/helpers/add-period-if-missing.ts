export function addPeriodIfMissing(sentence: string): string {
  sentence = sentence.trim();
  if (!/[.!?]$/.test(sentence)) {
    sentence += '.';
  }

  return sentence;
}
