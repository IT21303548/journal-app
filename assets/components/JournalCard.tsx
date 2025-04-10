import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JournalEntry } from '../../types/journal'; // Import JournalEntry
import { useFonts, Inter_700Bold, Inter_400Regular } from '@expo-google-fonts/inter';

type Props = {
  entry: JournalEntry;
  onEdit: () => void;
  onDelete: () => void;
};

const JournalCard = ({ entry, onEdit, onDelete }: Props) => {
  const [fontsLoaded] = useFonts({ Inter_700Bold, Inter_400Regular });

  const moodColors: { [key: string]: string } = {
    '😊': '#6B48FF',
    '🥳': '#FFD60A',
    '😐': '#A0A0A0',
    '😢': '#FF5A5F',
    '😡': '#FF5A5F',
  };

  if (!fontsLoaded) return null;

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: moodColors[entry.mood] || '#6B48FF', borderLeftWidth: 5 },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.date}>{entry.date}</Text>
        <Text style={styles.mood}>{entry.mood}</Text>
      </View>
      <Text style={styles.text}>{entry.text}</Text>
      {entry.image && (
        <Image source={{ uri: entry.image }} style={styles.image} />
      )}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <Ionicons name="pencil" size={20} color="#6B48FF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <Ionicons name="trash" size={20} color="#FF5A5F" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  mood: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
  },
  text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#2D2D2D',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 16,
  },
});

export default JournalCard;