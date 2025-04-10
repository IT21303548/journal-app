import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { addEntry, updateEntry, deleteEntry } from '../redux/journalSlice';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Inter_700Bold, Inter_400Regular } from '@expo-google-fonts/inter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, usePathname } from 'expo-router';
import JournalCard from '../assets/components/JournalCard';
import JournalForm from '../assets/components/JournalForm';
import { JournalEntry } from '../types/journal'; // Import JournalEntry

const JournalScreen = () => {
  const dispatch = useDispatch();
  const entries = useSelector((state: RootState) => state.journal.entries);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [editEntry, setEditEntry] = useState<JournalEntry | null>(null);
  const [fontsLoaded] = useFonts({ Inter_700Bold, Inter_400Regular });
  const pathname = usePathname();

  const addOrUpdateEntry = useCallback((entry: JournalEntry) => {
    if (editEntry) {
      dispatch(updateEntry({ ...entry, id: editEntry.id }));
    } else {
      dispatch(addEntry({ ...entry, id: Date.now().toString() }));
    }
    setModalVisible(false);
    setEditEntry(null);
  }, [editEntry, dispatch]);

  const deleteEntryHandler = useCallback((id: string) => {
    dispatch(deleteEntry(id));
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userName');
      router.replace('/');
      setMenuVisible(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const groupedEntries = entries.reduce((acc, entry) => {
    acc[entry.date] = acc[entry.date] || [];
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, JournalEntry[]>);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F6FA" />
      <View style={styles.header}>
        <Text style={styles.title}>My Journal 📓</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={28} color="#2D2D2D" />
        </TouchableOpacity>
      </View>
      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No entries yet. Start journaling! ✍️</Text>
        </View>
      ) : (
        <FlatList
          data={Object.entries(groupedEntries)}
          renderItem={({ item: [date, entries] }) => (
            <View style={styles.dateGroup}>
              <Text style={styles.date}>{date}</Text>
              {entries.map((entry) => (
                <JournalCard
                  key={entry.id}
                  entry={entry}
                  onEdit={() => {
                    setEditEntry(entry);
                    setModalVisible(true);
                  }}
                  onDelete={() => deleteEntryHandler(entry.id)}
                />
              ))}
            </View>
          )}
          keyExtractor={([date]) => date}
          contentContainerStyle={styles.entriesContainer}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
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
          onPress={() => {
            setEditEntry(null);
            setModalVisible(true);
          }}
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
            entry={editEntry}
            onSave={addOrUpdateEntry}
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
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#2D2D2D',
  },
  dateGroup: {
    marginBottom: 20,
  },
  date: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#6B48FF',
    marginBottom: 10,
  },
  entriesContainer: {
    paddingBottom: 20,
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

export default JournalScreen;