// app/create-account.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function CreateAccount() {
  const [username, setUsername] = useState('');
  const [isLandscape, setIsLandscape] = React.useState(
    Dimensions.get('window').width > Dimensions.get('window').height
  );

  React.useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setIsLandscape(width > height);
    };

    const subscription = Dimensions.addEventListener('change', updateOrientation);
    return () => subscription?.remove();
  }, []);

  const handleCreateAccount = () => {
    // Simulate account creation (in a real app, this would involve an API call)
    if (username.trim()) {
      router.push('/journal'); // Redirect to journal page after "account creation"
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isLandscape && styles.titleLandscape]}>
        Create Account
      </Text>
      <TextInput
        style={[styles.input, isLandscape && styles.inputLandscape]}
        placeholder="Enter your username"
        placeholderTextColor="#6B7280"
        value={username}
        onChangeText={setUsername}
      />
      <TouchableOpacity
        style={[styles.button, isLandscape && styles.buttonLandscape]}
        onPress={handleCreateAccount}
      >
        <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
          Create Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: wp('5%'),
  },
  title: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginBottom: hp('4%'),
  },
  titleLandscape: {
    fontSize: wp('5%'),
  },
  input: {
    width: wp('80%'),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: wp('3%'),
    padding: wp('3%'),
    fontSize: wp('4%'),
    color: '#2D2D2D',
    backgroundColor: '#FFFFFF',
    marginBottom: hp('3%'),
  },
  inputLandscape: {
    fontSize: wp('3.5%'),
    padding: wp('2%'),
  },
  button: {
    backgroundColor: '#6B48FF',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('8%'),
    borderRadius: wp('3%'),
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonLandscape: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('6%'),
  },
  buttonText: {
    fontSize: wp('4%'),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  buttonTextLandscape: {
    fontSize: wp('3.5%'),
  },
});