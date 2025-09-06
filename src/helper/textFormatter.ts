const FILLER_WORDS = ["of", "in", "and", "the"];

export function getAcronym(name?: string): string {
  if (!name) return "N/A";

  return name
    .split(/\s+/) // split into words
    .filter((word) => !FILLER_WORDS.includes(word.toLowerCase())) // remove fillers
    .map((word) => word[0]?.toUpperCase()) // take first letter
    .join(""); // join together
}
