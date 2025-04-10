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
- One-Time Account Creation: Users create an account by entering a username, which is stored locally and used for personalization.
- Journal List: Add new journal entries with text, mood, and optional images., View entries grouped by date in a scrollable list. , Edit and delete existing entries with a clean, card-based UI.
- Dashboard: Visualizes mood trends with a bar chart showing the frequency of each mood.,Displays entry frequency by date, helping users track their journaling habits.
- Responsive Design: Adapts to both portrait and landscape orientations with responsive layouts using react-native-responsive-screen.
- Mood Picker: A custom component with a variety of moods (emojis with names) for users to select their current mood.
- Local Storage: Persists user data and journal entries using AsyncStorage and redux-persist.

## Design Decisions
- **Database**: AsyncStorage is used for local data persistence, as required by the assignment. It stores the user’s name and journal entries via redux-persist.
- **Redux Toolkit**: Chosen for scalable state management. It handles user authentication (login/logout) and journal entries (add, update, delete) with persistence.
- Expo Router: Used for navigation, leveraging Expo’s file-based routing for a seamless navigation experience.
- Custom UI Components: Built custom components (e.g., JournalCard, MoodPicker, JournalForm) for a consistent and clean UI, styled with LinearGradient for visual appeal.
- Responsive Design: Utilizes react-native-responsive-screen (wp and hp) to ensure the app looks great on different screen sizes and orientations.
- Animations: Added subtle animations using react-native-reanimated (e.g., FadeIn, FadeInDown) to enhance the user experience.
- Mood Tracking: A wide range of moods with names (e.g., "Smiling Face", "Crying Face") to make the mood picker more expressive and user-friendly.

## Third-Party Libraries
- expo-router: Navigation using file-based routing.
- @react-native-async-storage/async-storage: Local database for persisting user data and journal entries.
- redux, @reduxjs/toolkit, redux-persist: State management with persistence for user data and journal entries.
- expo-image-picker: For attaching images to journal entries.
- react-native-responsive-screen: For responsive layouts using percentage-based dimensions (wp, hp).
- react-native-reanimated: For smooth animations (e.g., fading in journal cards, buttons).
- expo-linear-gradient: For gradient backgrounds in headers, buttons, and visualizations.
- @expo-google-fonts/inter: For custom fonts (Inter_400Regular, Inter_700Bold) to enhance typography.
- @expo/vector-icons: For icons (e.g., Ionicons) used in buttons and navigation.

## Known Limitations
- Visualizations: The dashboard visualizations (mood trends and entry frequency) are basic and do not limit data to the last 5 days as mentioned in the template, but they could be enhanced with more advanced charting libraries like react-native-chart-kit in the future.
- AsyncStorage Limits: AsyncStorage has size limits, but it’s sufficient for this app’s scope (storing text, small images as URIs, and user data).
- Image Handling: Images are stored as URIs, which may lead to issues if the image file is deleted from the device. A future improvement could involve copying images to a local directory using expo-file-system
- No Offline Image Caching: If the app is used offline, images may not load if the URI is no longer accessible.
Performance: On very large datasets (e.g., hundreds of entries with images), the FlatList in the journal page might experience performance issues. Virtualization is already used, but further optimization (e.g., lazy loading images) could be added.

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











