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
![App Page](https://github.com/user-attachments/assets/a743690f-aa69-48d5-b5c9-77447248e776)
![Create Account](https://github.com/user-attachments/assets/8bf4e476-d912-41e9-a71c-b9a1197abdc2)
![Home](https://github.com/user-attachments/assets/f7996ff9-ef1f-4686-ba9f-59fc39f1cbfa)
![Add Entry](https://github.com/user-attachments/assets/1828a4c8-e4fa-42d8-8e01-37b0ebbdd360)
![WhatsApp Image 2025-04-11 at 03 28 47_06bc3137](https://github.com/user-attachments/assets/e709dec2-50b1-403f-913d-eac95bd825c9)
![WhatsApp Image 2025-04-11 at 03 28 47_3f60549d](https://github.com/user-attachments/assets/197c8b64-ecd6-46b3-91e8-498ad5adc5e3)
![WhatsApp Image 2025-04-11 at 03 28 48_42bd9241](https://github.com/user-attachments/assets/9a0f0824-d578-4d0d-9af3-fd9bb55bec35)
![WhatsApp Image 2025-04-11 at 03 28 48_afa059cf](https://github.com/user-attachments/assets/996a9e92-a9f2-4150-a63f-c5841fb69d9e)
![WhatsApp Image 2025-04-11 at 03 28 49_75a2b19e](https://github.com/user-attachments/assets/02047b91-3fbb-476d-9e9e-e5df5ddb46c9)
![WhatsApp Image 2025-04-11 at 03 28 49_ad8709bc](https://github.com/user-attachments/assets/955e7f07-f0fa-4988-a76e-514426b86b43)
![WhatsApp Image 2025-04-11 at 03 28 49_9c24daed](https://github.com/user-attachments/assets/3cdae7b6-0641-441b-9756-308c5a0bfe74)
![WhatsApp Image 2025-04-11 at 03 28 50_3f73a611](https://github.com/user-attachments/assets/cccb72e4-7f27-4e1f-b6d1-3170e640ccd3)











