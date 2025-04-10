// assets/components/MoodPicker.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type MoodPickerProps = {
  selectedMood: string;
  onSelectMood: (mood: string) => void;
};

const moods = ['😊', '😢', '😡', '😴', '🤩'];

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
        How are you feeling?
      </Text>
      <View style={styles.moodContainer}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[
              styles.moodButton,
              selectedMood === mood && styles.selectedMood,
              isLandscape && styles.moodButtonLandscape,
            ]}
            onPress={() => onSelectMood(mood)}
          >
            <Text style={[styles.moodText, isLandscape && styles.moodTextLandscape]}>{mood}</Text>
          </TouchableOpacity>
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
});

export default MoodPicker;