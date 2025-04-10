import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import MoodPicker from './MoodPicker';
import * as ImagePicker from 'expo-image-picker';
import { useFonts, Inter_700Bold, Inter_400Regular } from '@expo-google-fonts/inter';
import { JournalEntry } from '../../types/journal'; // Import JournalEntry

type Props = {
  entry: JournalEntry | null;
  onSave: (entry: JournalEntry) => void;
  onCancel: () => void;
};

export default function JournalForm({ entry, onSave, onCancel }: Props) {
  const [text, setText] = useState(entry?.text || '');
  const [mood, setMood] = useState(entry?.mood || '😊');
  const [image, setImage] = useState<string | undefined>(entry?.image);
  const [fontsLoaded] = useFonts({ Inter_700Bold, Inter_400Regular });

  const handleSave = () => {
    const newEntry: JournalEntry = {
      id: entry?.id || Date.now().toString(), // Provide a new ID if entry is null or id is undefined
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }),
      text,
      mood,
      image,
    };
    onSave(newEntry);
    setText('');
    setMood('😊');
    setImage(undefined);
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImage(result.assets[0].uri);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{entry ? 'Edit Entry ✍️' : 'New Entry ✍️'}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Write your thoughts..."
        placeholderTextColor="#6B7280"
        value={text}
        onChangeText={setText}
        multiline
      />
      <MoodPicker selectedMood={mood} onSelectMood={setMood} />
      <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
        <Text style={styles.buttonText}>Add Image 📸</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Entry ✅</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  header: {
    backgroundColor: '#6B48FF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    margin: -20,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#2D2D2D',
    textAlignVertical: 'top',
    backgroundColor: '#F9FAFB',
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: '#FFD60A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  addButton: {
    backgroundColor: '#6B48FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: '#FF5A5F',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});