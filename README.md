# JournalApp

A React Native journaling app with local storage, mood tracking, and visualizations, built with Expo.

## Setup Instructions
1. Clone the repo: `git clone <repo-url>`
2. Install dependencies: `npx expo install`
3. Run the app:
   - `npx expo start`
   - Press `a` for Android or `i` for iOS (or scan the QR code with the Expo Go app).

## Features
- Splash screen with logo and navigation
- One-time account creation
- Journal List: Add, view (grouped by date), and delete entries with mood and optional images
- Dashboard: Mood trends and entry frequency visualizations

## Design Decisions
- **Database**: AsyncStorage is used for local data persistence, as required by the assignment. It stores the user’s name and journal entries (via Redux Persist).
- **Redux Toolkit**: For scalable state management with persistence.
- **React Native Paper**: For consistent, clean UI.
- **Chart Kit**: Lightweight charting for visualizations.
- **Expo Router**: For navigation, leveraging Expo’s file-based routing.

## Third-Party Libraries
- `expo-router`: Navigation
- `@react-native-async-storage/async-storage`: Local database for persisting user data and journal entries
- `redux`, `@reduxjs/toolkit`, `redux-persist`: State management with persistence
- `react-native-paper`: UI components
- `react-native-chart-kit`: Visualizations
- `expo-image-picker`, `expo-file-system`: Image attachment
- `react-native-safe-area-context`: Safe area handling

## Known Limitations
- No editing of existing entries (future improvement).
- Visualizations limited to last 5 days.
- AsyncStorage has size limits, but sufficient for this app’s scope.

## Screenshots

