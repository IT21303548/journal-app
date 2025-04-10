import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useFonts, Inter_700Bold, Inter_400Regular } from '@expo-google-fonts/inter';
import { Ionicons } from '@expo/vector-icons';

const Index = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [fontsLoaded] = useFonts({ Inter_700Bold, Inter_400Regular });

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem('userName');
        setUserName(storedUserName);
        setIsFirstLaunch(storedUserName === null);
      } catch (error) {
        console.error('Error checking userName:', error);
        setIsFirstLaunch(true);
      }
    };
    checkFirstLaunch();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userName');
      setUserName(null);
      setIsFirstLaunch(true);
      setMenuVisible(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!fontsLoaded || isFirstLaunch === null) {
    return <View style={styles.loading}><Text style={styles.loadingText}>Loading... ⏳</Text></View>;
  }

  if (isFirstLaunch) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#6B48FF" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Journal App 📝</Text>
        </View>
        <View style={styles.gradientOverlay}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }} // Replace with require('../assets/logo.png')
            style={styles.logo}
          />
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push('/create-account')}
          >
            <Text style={styles.nextButtonText}>Get Started 🚀</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.splashContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#6B48FF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome, {userName}! 👋</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.gradientOverlay}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Replace with require('../assets/logo.png')
          style={styles.logo}
        />
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => router.push('/journal')}
        >
          <Text style={styles.nextButtonText}>Go to Journal 📓</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out" size={20} color="#FF5A5F" />
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#6B48FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  nextButton: {
    backgroundColor: '#FFD60A',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#2D2D2D',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80,
    paddingRight: 20,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#FF5A5F',
    marginLeft: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: '#2D2D2D',
  },
});

export default Index;