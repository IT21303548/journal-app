import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { FadeIn } from 'react-native-reanimated';

type MoodPickerProps = {
  selectedMood: string;
  onSelectMood: (mood: string) => void;
};

// Expanded list of moods with names
const moods = [
  { emoji: '😊', name: 'Smiling Face' },
  { emoji: '😢', name: 'Crying Face' },
  { emoji: '😡', name: 'Angry Face' },
  { emoji: '😴', name: 'Sleeping Face' },
  { emoji: '🤩', name: 'Star-Struck' },
  { emoji: '😂', name: 'Laughing Face' },
  { emoji: '😍', name: 'Heart Eyes' },
  { emoji: '😱', name: 'Shocked Face' },
  { emoji: '🤔', name: 'Thinking Face' },
  { emoji: '😎', name: 'Cool Face' },
  { emoji: '🥳', name: 'Partying Face' },
  { emoji: '😞', name: 'Sad Face' },
  { emoji: '🤗', name: 'Hugging Face' },
  { emoji: '😜', name: 'Winking Face' },
  { emoji: '🤯', name: 'Mind Blown' },
];

const MoodPicker: React.FC<MoodPickerProps> = React.memo(({ selectedMood, onSelectMood }) => {
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
      <Text style={[styles.label, isLandscape && styles.labelLandscape]}>
        How are you feeling? 🌈
      </Text>
      <View style={styles.moodContainer}>
        {moods.map((mood, index) => (
          <Animated.View
            key={mood.emoji}
            entering={FadeIn.delay(index * 100).duration(300)}
          >
            <TouchableOpacity
              style={[
                styles.moodButton,
                selectedMood === mood.emoji && styles.selectedMood,
                isLandscape && styles.moodButtonLandscape,
              ]}
              onPress={() => onSelectMood(mood.emoji)}
            >
              <Text style={[styles.moodText, isLandscape && styles.moodTextLandscape]}>
                {mood.emoji}
              </Text>
              <Text style={[styles.moodName, isLandscape && styles.moodNameLandscape]}>
                {mood.name}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('2%'),
  },
  label: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginBottom: hp('1%'),
  },
  labelLandscape: {
    fontSize: wp('3.5%'),
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  moodButton: {
    padding: wp('3%'),
    borderRadius: wp('2%'),
    backgroundColor: '#E5E7EB',
    margin: wp('1%'),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  moodButtonLandscape: {
    padding: wp('2%'),
  },
  selectedMood: {
    backgroundColor: '#6B48FF',
  },
  moodText: {
    fontSize: wp('5%'),
  },
  moodTextLandscape: {
    fontSize: wp('4%'),
  },
  moodName: {
    fontSize: wp('3%'),
    color: '#2D2D2D',
    marginTop: hp('0.5%'),
  },
  moodNameLandscape: {
    fontSize: wp('2.5%'),
  },
});

export default MoodPicker;