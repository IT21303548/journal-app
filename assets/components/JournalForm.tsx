import { Inter_400Regular, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { JournalEntry } from '../../types/journal';
import MoodPicker from './MoodPicker';

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
  const user = useSelector((state: RootState) => state.journal.user);
  const [isLandscape, setIsLandscape] = useState(
    Dimensions.get('window').width > Dimensions.get('window').height
  );

  const saveScale = useSharedValue(1);
  const cancelScale = useSharedValue(1);

  const saveAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

  const cancelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cancelScale.value }],
  }));

  const handleSavePressIn = () => {
    saveScale.value = withSpring(0.95);
  };

  const handleSavePressOut = () => {
    saveScale.value = withSpring(1);
  };

  const handleCancelPressIn = () => {
    cancelScale.value = withSpring(0.95);
  };

  const handleCancelPressOut = () => {
    cancelScale.value = withSpring(1);
  };

  React.useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setIsLandscape(width > height);
    };
    const subscription = Dimensions.addEventListener('change', updateOrientation);
    return () => subscription?.remove();
  }, []);

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Not Logged In', 'Please log in to save your journal entry.');
      return;
    }

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
      keyboardVerticalOffset={Platform.OS === 'ios' ? hp('10%') : hp('5%')}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, isLandscape && styles.scrollContainerLandscape]}
        showsVerticalScrollIndicator={true}
      >
        <Animated.View entering={FadeIn.duration(300)} style={[styles.container, isLandscape && styles.containerLandscape]}>
          <LinearGradient
            colors={['#2e7d1b', '#5ae73b']}
            style={styles.header}
          >
            <Text style={[styles.title, isLandscape && styles.titleLandscape]}>
              {entry ? 'Edit Entry ✍️' : 'New Entry 📝'}
            </Text>
          </LinearGradient>
          <TextInput
            style={[styles.input, isLandscape && styles.inputLandscape]}
            placeholder={
              entry
                ? 'Write your thoughts...'
                : 'Write your thoughts... ✍️'
            }
            placeholderTextColor="#6B7280"
            value={text}
            onChangeText={setText}
            multiline
            autoFocus={!entry}
            textAlignVertical="top"
          />
          <MoodPicker selectedMood={mood} onSelectMood={setMood} />
          <TouchableOpacity style={styles.imageButton} onPress={handleImagePick} disabled={isSaving}>
            <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
              {entry
                ? 'Add Image 📸'
                : 'Add Image 📸'}
            </Text>
          </TouchableOpacity>
          {image && (
            <View style={styles.imageContainer}>
              <Text style={[styles.imageLabel, isLandscape && styles.imageLabelLandscape]}>
                {entry
                  ? 'Your Image 🖼️'
                  : 'Your Image 🖼️ Picture'}
              </Text>
              <Image
                source={{ uri: image }}
                style={[styles.imagePreview, isLandscape && styles.imagePreviewLandscape]}
              />
            </View>
          )}
          <View style={[styles.buttonContainer, isLandscape && styles.buttonContainerLandscape]}>
            <Animated.View style={saveAnimatedStyle}>
              <TouchableOpacity
                onPressIn={handleSavePressIn}
                onPressOut={handleSavePressOut}
                onPress={handleSave}
                disabled={isSaving}
              >
                <LinearGradient
                  colors={['#2e7d1b', '#5ae73b']}
                  style={[styles.addButton, isLandscape && styles.addButtonLandscape]}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={wp('5%')} color="#FFFFFF" />
                      <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
                        {entry
                          ? 'Save ✅'
                          : 'Save ✅'}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={cancelAnimatedStyle}>
              <TouchableOpacity
                onPressIn={handleCancelPressIn}
                onPressOut={handleCancelPressOut}
                onPress={onCancel}
                disabled={isSaving}
              >
                <LinearGradient
                  colors={['#ff4444', '#FF8C8F']}
                  style={[styles.cancelButton, isLandscape && styles.cancelButtonLandscape]}
                >
                  <Ionicons name="close" size={wp('5%')} color="#FFFFFF" />
                  <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
                    {entry
                      ? 'Cancel 🚫'
                      : 'Cancel 🚫'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: hp('5%'),
  },
  scrollContainerLandscape: {
    paddingBottom: hp('3%'),
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('5%'),
    padding: wp('5%'),
    marginHorizontal: wp('5%'),
    marginVertical: hp('5%'),
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    width: wp('90%'),
  },
  containerLandscape: {
    marginVertical: hp('3%'),
    width: wp('70%'),
    padding: wp('3%'),
  },
  header: {
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
    padding: wp('2%'),
  },
  imageButton: {
    backgroundColor: '#7c7c7c',
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
  imageContainer: {
    alignItems: 'center',
  },
  imageLabel: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
    marginBottom: hp('1%'),
  },
  imageLabelLandscape: {
    fontSize: wp('3%'),
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
    justifyContent: 'space-between', // Changed to space-between to ensure buttons are on the same level
    marginTop: hp('2%'),
    paddingHorizontal: wp('5%'), // Increased padding to give more space
  },
  buttonContainerLandscape: {
    marginTop: hp('1%'),
    paddingHorizontal: wp('3%'),
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'), // Reduced padding to fit better on smaller screens
    borderRadius: wp('8%'),
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: wp('40%'), // Set a fixed width to ensure buttons fit
    justifyContent: 'center',
  },
  addButtonLandscape: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    width: wp('35%'),
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('8%'),
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: wp('40%'),
    justifyContent: 'center',
  },
  cancelButtonLandscape: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    width: wp('35%'),
  },
  buttonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: wp('4%'),
    color: '#FFFFFF',
    textAlign: 'center',
    marginLeft: wp('2%'),
  },
  buttonTextLandscape: {
    fontSize: wp('3.5%'),
  },
});