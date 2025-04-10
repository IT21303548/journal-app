export interface JournalEntry {
    id: string;
    text: string;
    mood: string; // e.g., "😊", "😐", "😢"
    date: string; // ISO string, e.g., "2025-04-09"
    image?: string; // URI for optional image
  }