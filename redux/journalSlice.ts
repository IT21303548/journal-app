import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JournalEntry } from '../types/journal';

interface JournalState {
  entries: JournalEntry[];
  user: string | null; // Track the logged-in user
}

const initialState: JournalState = {
  entries: [],
  user: null, // Initially, no user is logged in
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    addEntry: (state, action: PayloadAction<JournalEntry>) => {
      if (state.user) { // Only allow adding entries if a user is logged in
        state.entries.push(action.payload);
      }
    },
    updateEntry: (state, action: PayloadAction<JournalEntry>) => {
      if (state.user) { // Only allow updating entries if a user is logged in
        const index = state.entries.findIndex((entry) => entry.id === action.payload.id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      }
    },
    deleteEntry: (state, action: PayloadAction<string>) => {
      if (state.user) { // Only allow deleting entries if a user is logged in
        state.entries = state.entries.filter((entry) => entry.id !== action.payload);
      }
    },
    login: (state, action: PayloadAction<string>) => {
      state.user = action.payload; // Set the logged-in user
    },
    logout: (state) => {
      state.entries = []; // Clear all entries on logout
      state.user = null; // Clear the user on logout
    },
  },
});

export const { addEntry, updateEntry, deleteEntry, login, logout } = journalSlice.actions;
export default journalSlice.reducer;