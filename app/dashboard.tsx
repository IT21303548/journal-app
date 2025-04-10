import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { useFonts, Inter_700Bold, Inter_400Regular } from '@expo-google-fonts/inter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import JournalForm from '../assets/components/JournalForm';
import { addEntry } from '../redux/journalSlice';
import { JournalEntry } from '../types/journal'; // Import JournalEntry

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const entries = useSelector((state: RootState) => state.journal.entries);
  const [fontsLoaded] = useFonts({ Inter_700Bold, Inter_400Regular });
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userName');
      router.replace('/');
      setMenuVisible(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleAddEntry = (entry: JournalEntry) => {
    dispatch(addEntry({ ...entry, id: Date.now().toString() }));
    setModalVisible(false);
  };

  const moodData = entries.slice(0, 10).map((e) => ({
    date: e.date.slice(0, 5),
    score: ['😊', '🥳'].includes(e.mood) ? 5 : ['😐'].includes(e.mood) ? 3 : 1,
  }));

  const frequencyData = entries.slice(0, 10).reduce((acc: { [key: string]: number }, e) => {
    const date = e.date.slice(0, 5);
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const maxFrequency = Math.max(...Object.values(frequencyData), 1);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F6FA" />
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard 📊</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={28} color="#2D2D2D" />
        </TouchableOpacity>
      </View>
      {entries.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Mood Trends 🌈</Text>
            {moodData.map((data, index) => (
              <View key={index} style={styles.chartRow}>
                <Text style={styles.chartLabel}>{data.date}</Text>
                <View style={styles.chartBarContainer}>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        width: `${(data.score / 5) * 100}%`,
                        backgroundColor: data.score >= 4 ? '#6B48FF' : data.score >= 2 ? '#FFD60A' : '#FF5A5F',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.chartValue}>{data.score}/5</Text>
              </View>
            ))}
          </View>
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Entry Frequency ⏰</Text>
            {Object.entries(frequencyData).map(([date, count], index) => (
              <View key={index} style={styles.chartRow}>
                <Text style={styles.chartLabel}>{date}</Text>
                <View style={styles.chartBarContainer}>
                  <View
                    style={[
                      styles.chartBar,
                      { width: `${(count / maxFrequency) * 100}%`, backgroundColor: '#6B48FF' },
                    ]}
                  />
                </View>
                <Text style={styles.chartValue}>{count}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Add some entries to see your stats! 📈</Text>
        </View>
      )}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => router.push('/journal')}
        >
          <Ionicons
            name="book"
            size={28}
            color={pathname === '/journal' ? '#6B48FF' : '#A0A0A0'}
          />
          <Text
            style={[
              styles.footerText,
              { color: pathname === '/journal' ? '#6B48FF' : '#A0A0A0' },
            ]}
          >
            Journal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={32} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => router.push('/dashboard')}
        >
          <Ionicons
            name="stats-chart"
            size={28}
            color={pathname === '/dashboard' ? '#6B48FF' : '#A0A0A0'}
          />
          <Text
            style={[
              styles.footerText,
              { color: pathname === '/dashboard' ? '#6B48FF' : '#A0A0A0' },
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <JournalForm
            entry={null}
            onSave={handleAddEntry}
            onCancel={() => setModalVisible(false)}
          />
        </View>
      </Modal>
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
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
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingTop: 40,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: '#2D2D2D',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  chartTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#6B48FF',
    marginBottom: 15,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#2D2D2D',
    width: 60,
  },
  chartBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  chartBar: {
    height: '100%',
    borderRadius: 6,
  },
  chartValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#6B48FF',
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerButton: {
    alignItems: 'center',
    paddingVertical: 5,
    flex: 1,
    borderRadius: 10,
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 5,
  },
  fab: {
    backgroundColor: '#6B48FF',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  menuOverlay: {
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
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#FFF5F5',
  },
  menuText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#FF5A5F',
    marginLeft: 10,
  },
});

export default DashboardScreen;