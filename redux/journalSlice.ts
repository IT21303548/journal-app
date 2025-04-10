import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JournalEntry } from '../types/journal'; // Import JournalEntry

interface JournalState {
  entries: JournalEntry[];
}

const initialState: JournalState = {
  entries: [],
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    addEntry: (state, action: PayloadAction<JournalEntry>) => {
      state.entries.push(action.payload);
    },
    updateEntry: (state, action: PayloadAction<JournalEntry>) => {
      const index = state.entries.findIndex((entry) => entry.id === action.payload.id);
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
    },
    deleteEntry: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter((entry) => entry.id !== action.payload);
    },
  },
});

export const { addEntry, updateEntry, deleteEntry } = journalSlice.actions;
export default journalSlice.reducer;