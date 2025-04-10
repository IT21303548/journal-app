import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import { login } from '../redux/journalSlice';

export default function CreateAccount() {
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();
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
    if (username.trim()) {
      dispatch(login(username));
      router.push('/journal');
    }
  };

  return (
    <LinearGradient
      colors={['#18230F', '#27391C']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Ionicons name="person-add" size={wp('12%')} color="#FFFFFF" style={styles.icon} />
        <Text style={[styles.title, isLandscape && styles.titleLandscape]}>
          Create Your Account 🧑‍💻
        </Text>
        <TextInput
          style={[styles.input, isLandscape && styles.inputLandscape]}
          placeholder="Enter your username 👤"
          placeholderTextColor="#FFFFFF"
          value={username}
          onChangeText={setUsername}
        />
        <TouchableOpacity
          style={[styles.button, isLandscape && styles.buttonLandscape]}
          onPress={handleCreateAccount}
        >
          <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
            Start Journaling 
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: wp('5%'),
  },
  icon: {
    marginBottom: hp('3%'),
  },
  title: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: hp('4%'),
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  titleLandscape: {
    fontSize: wp('5%'),
  },
  input: {
    width: wp('80%'),
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: wp('5%'),
    padding: wp('3%'),
    fontSize: wp('4%'),
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: hp('3%'),
  },
  inputLandscape: {
    fontSize: wp('3.5%'),
    padding: wp('2%'),
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('8%'),
    borderRadius: wp('10%'),
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonLandscape: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('6%'),
  },
  buttonText: {
    fontSize: wp('4%'),
    color: '#6B48FF',
    fontWeight: 'bold',
  },
  buttonTextLandscape: {
    fontSize: wp('3.5%'),
  },
});