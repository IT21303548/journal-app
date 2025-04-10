import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

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
    <LinearGradient
      colors={['#18230F', '#27391C']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Ionicons name="book" size={wp('15%')} color="#FFFFFF" style={styles.icon} />
        <Text style={[styles.title, isLandscape && styles.titleLandscape]}>
          Welcome to Journal App 📖
        </Text>
        <Text style={[styles.subtitle, isLandscape && styles.subtitleLandscape]}>
          Capture your thoughts, moods, and memories in a creative way! 🌟✨
        </Text>
        <TouchableOpacity
          style={[styles.button, isLandscape && styles.buttonLandscape]}
          onPress={() => router.push('/create-account')}
        >
          <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
            Get Started 🚀
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
    fontSize: wp('8%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  titleLandscape: {
    fontSize: wp('6%'),
  },
  subtitle: {
    fontSize: wp('4%'),
    color: '#FFFFFF',
    marginVertical: hp('2%'),
    textAlign: 'center',
    opacity: 0.9,
  },
  subtitleLandscape: {
    fontSize: wp('3.5%'),
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