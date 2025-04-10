import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { logout } from '../redux/journalSlice';
import { RootState, persistor, store } from '../redux/store';

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.journal.user);
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

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/');
  };

  return (
    <LinearGradient colors={['#27391C', '#71cf46']} style={[styles.header, isLandscape && styles.headerLandscape]}>
      <Text style={[styles.headerTitle, isLandscape && styles.headerTitleLandscape]}>
        {user ? `Hello, ${user}! 👋` : 'Journal App 📖'}
      </Text>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={[styles.logoutText, isLandscape && styles.logoutTextLandscape]}>
          Logout
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default function Layout() {
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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={styles.container}>
          <Stack
            screenOptions={{
              header: () => <Header />,
            }}
          />
          <View style={[styles.footer, isLandscape && styles.footerLandscape]}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => router.push('/journal')}
            >
              <Ionicons name="book-outline" size={wp('6%')} color="#6B48FF" />
              <Text style={[styles.footerText, isLandscape && styles.footerTextLandscape]}>
                Journal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fab, isLandscape && styles.fabLandscape]}
              onPress={() => router.push('/journal?openForm=true')}
            >
              <Ionicons name="add" size={wp('8%')} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => router.push('/dashboard')}
            >
              <Ionicons name="stats-chart-outline" size={wp('6%')} color="#6B48FF" />
              <Text style={[styles.footerText, isLandscape && styles.footerTextLandscape]}>
                Dashboard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  headerLandscape: {
    paddingVertical: hp('1%'),
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerTitleLandscape: {
    fontSize: wp('4%'),
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
  },
  logoutText: {
    fontSize: wp('4%'),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  logoutTextLandscape: {
    fontSize: wp('3.5%'),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: hp('2%'),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  footerLandscape: {
    paddingVertical: hp('1%'),
  },
  footerButton: {
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
  },
  footerText: {
    fontSize: wp('3.5%'),
    color: '#6B48FF',
  },
  footerTextLandscape: {
    fontSize: wp('3%'),
  },
  fab: {
    backgroundColor: '#6B48FF',
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -hp('3%'),
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  fabLandscape: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    marginTop: -hp('2%'),
  },
});