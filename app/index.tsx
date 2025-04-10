// app/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Index() {
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

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isLandscape && styles.titleLandscape]}>
        Welcome to Journal App 📖
      </Text>
      <Text style={[styles.subtitle, isLandscape && styles.subtitleLandscape]}>
        Start by creating an account to begin journaling.
      </Text>
      <TouchableOpacity
        style={[styles.button, isLandscape && styles.buttonLandscape]}
        onPress={() => router.push('/create-account')}
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
    fontSize: wp('8%'),
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  titleLandscape: {
    fontSize: wp('6%'),
  },
  subtitle: {
    fontSize: wp('4%'),
    color: '#6B7280',
    marginBottom: hp('4%'),
    textAlign: 'center',
  },
  subtitleLandscape: {
    fontSize: wp('3.5%'),
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