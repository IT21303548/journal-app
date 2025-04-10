import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useFonts, Inter_700Bold, Inter_400Regular } from '@expo-google-fonts/inter';

const CreateAccountScreen = () => {
  const [userName, setUserName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fontsLoaded] = useFonts({ Inter_700Bold, Inter_400Regular });

  const handleCreateAccount = async () => {
    if (userName.trim()) {
      try {
        await AsyncStorage.removeItem('userName');
        await AsyncStorage.setItem('userName', userName);
        router.replace('/journal');
      } catch (err) {
        console.error('Error saving userName:', err);
        setError('Failed to save your name. Please try again.');
      }
    } else {
      setError('Please enter a valid name.');
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F6FA" />
      <View style={styles.card}>
        <Text style={styles.title}>Welcome! 🌟</Text>
        <Text style={styles.subtitle}>Let's get started with your name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#6B7280"
          value={userName}
          onChangeText={setUserName}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>Create Account ✅</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#2D2D2D',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#2D2D2D',
    backgroundColor: '#F9FAFB',
    marginBottom: 20,
  },
  errorText: {
    color: '#FF5A5F',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#6B48FF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default CreateAccountScreen;