import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts, Inter_700Bold, Inter_400Regular } from '@expo-google-fonts/inter';

type Props = {
  selectedMood: string;
  onSelectMood: (mood: string) => void;
};

const moods = ['😊', '😢', '😡', '😐', '🥳'];

const MoodPicker = ({ selectedMood, onSelectMood }: Props) => {
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
    <View style={styles.container}>
      {moods.map((mood) => (
        <TouchableOpacity
          key={mood}
          style={[
            styles.moodButton,
            { backgroundColor: selectedMood === mood ? moodColors[mood] : '#FFFFFF' },
            selectedMood === mood && styles.selectedMood,
          ]}
          onPress={() => onSelectMood(mood)}
        >
          <Text
            style={[
              styles.moodText,
              { color: selectedMood === mood ? '#FFFFFF' : '#2D2D2D' },
            ]}
          >
            {mood}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  moodButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedMood: {
    borderColor: '#FFFFFF',
    shadowOpacity: 0.3,
  },
  moodText: {
    fontSize: 28,
  },
});

export default MoodPicker;