import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MoodPicker from './MoodPicker';
import * as ImagePicker from 'expo-image-picker';
import { useFonts, Inter_700Bold, Inter_400Regular } from '@expo-google-fonts/inter';
import { JournalEntry } from '../../types/journal';

type Props = {
  entry: JournalEntry | null;
  onSave: (entry: JournalEntry) => void;
  onCancel: () => void;
};

export default function JournalForm({ entry, onSave, onCancel }: Props) {
  const [text, setText] = useState(entry?.text || '');
  const [mood, setMood] = useState(entry?.mood || '😊');
  const [image, setImage] = useState<string | undefined>(entry?.image);
  const [isSaving, setIsSaving] = useState(false);
  const [fontsLoaded] = useFonts({ Inter_700Bold, Inter_400Regular });
  const [isLandscape, setIsLandscape] = useState(
    Dimensions.get('window').width > Dimensions.get('window').height
  );

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setIsLandscape(width > height);
    };
    const subscription = Dimensions.addEventListener('change', updateOrientation);
    return () => subscription?.remove();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const newEntry: JournalEntry = {
        id: entry?.id || Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        text,
        mood,
        image,
      };
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSave(newEntry);
    } finally {
      setIsSaving(false);
    }
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
    >
      <View style={[styles.container, isLandscape && styles.containerLandscape]}>
        <View style={styles.header}>
          <Text style={[styles.title, isLandscape && styles.titleLandscape]}>
            {entry ? 'Edit Entry ✍️' : 'New Entry ✍️'}
          </Text>
        </View>
        <TextInput
          style={[styles.input, isLandscape && styles.inputLandscape]}
          placeholder="Write your thoughts..."
          placeholderTextColor="#6B7280"
          value={text}
          onChangeText={setText} // Removed debounce for instant feedback
          multiline
          autoFocus={!entry} // Auto-focus on new entry
          textAlignVertical="top"
        />
        <MoodPicker selectedMood={mood} onSelectMood={setMood} />
        <TouchableOpacity style={styles.imageButton} onPress={handleImagePick} disabled={isSaving}>
          <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
            Add Image 📸
          </Text>
        </TouchableOpacity>
        {image && (
          <Image
            source={{ uri: image }}
            style={[styles.imagePreview, isLandscape && styles.imagePreviewLandscape]}
          />
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel} disabled={isSaving}>
            <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleSave} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
                Save Entry ✅
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('5%'),
    padding: wp('5%'),
    marginHorizontal: wp('5%'),
    marginVertical: hp('10%'),
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    width: wp('90%'),
    maxHeight: hp('80%'),
  },
  containerLandscape: {
    marginVertical: hp('5%'),
    maxHeight: hp('90%'),
    width: wp('70%'),
  },
  header: {
    backgroundColor: '#6B48FF',
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    padding: wp('4%'),
    margin: -wp('5%'),
    marginBottom: wp('5%'),
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: wp('6%'),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  titleLandscape: {
    fontSize: wp('4%'),
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: wp('3%'),
    padding: wp('3%'),
    minHeight: hp('15%'),
    fontSize: wp('4%'),
    fontFamily: 'Inter_400Regular',
    color: '#2D2D2D',
    backgroundColor: '#F9FAFB',
    marginBottom: hp('2%'),
  },
  inputLandscape: {
    minHeight: hp('10%'),
    fontSize: wp('3.5%'),
  },
  imageButton: {
    backgroundColor: '#FFD60A',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  imagePreview: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
    alignSelf: 'center',
  },
  imagePreviewLandscape: {
    width: wp('15%'),
    height: wp('15%'),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: hp('2%'),
  },
  addButton: {
    backgroundColor: '#6B48FF',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('8%'),
    borderRadius: wp('8%'),
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    margin: wp('2%'),
  },
  cancelButton: {
    backgroundColor: '#FF5A5F',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('8%'),
    borderRadius: wp('8%'),
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    margin: wp('2%'),
  },
  buttonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: wp('4%'),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  buttonTextLandscape: {
    fontSize: wp('3.5%'),
  },
});