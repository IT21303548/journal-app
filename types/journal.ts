// types/journal.ts
export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  mood: string;
  image?: string;
}