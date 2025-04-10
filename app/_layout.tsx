import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store';
import { Text } from 'react-native';
import { Slot } from 'expo-router'; // Import Slot from expo-router

const RootLayout = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <Slot /> {/* Renders the current route */}
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;