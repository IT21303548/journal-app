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
  Alert,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MoodPicker from './MoodPicker';
import * as ImagePicker from 'expo-image-picker';
import { useFonts, Inter_700Bold, Inter_400Regular } from '@expo-google-fonts/inter';
import { JournalEntry } from '../../types/journal';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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
    >
      <Animated.View entering={FadeIn.duration(300)} style={[styles.container, isLandscape && styles.containerLandscape]}>
        <LinearGradient
          colors={['#6B48FF', '#FFD60A']}
          style={styles.header}
        >
          <Text style={[styles.title, isLandscape && styles.titleLandscape]}>
            {entry ? 'Edit Entry ✍️' : 'New Entry 📝'}
          </Text>
        </LinearGradient>
        <TextInput
          style={[styles.input, isLandscape && styles.inputLandscape]}
          placeholder="Write your thoughts... ✍️"
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
          <Animated.View style={cancelAnimatedStyle}>
            <TouchableOpacity
              onPressIn={handleCancelPressIn}
              onPressOut={handleCancelPressOut}
              onPress={onCancel}
              disabled={isSaving}
            >
              <LinearGradient
                colors={['#FF5A5F', '#FF8C8F']}
                style={styles.cancelButton}
              >
                <Ionicons name="close" size={wp('5%')} color="#FFFFFF" />
                <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
                  Cancel 🚫
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={saveAnimatedStyle}>
            <TouchableOpacity
              onPressIn={handleSavePressIn}
              onPressOut={handleSavePressOut}
              onPress={handleSave}
              disabled={isSaving}
            >
              <LinearGradient
                colors={['#6B48FF', '#FFD60A']}
                style={styles.addButton}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={wp('5%')} color="#FFFFFF" />
                    <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
                      Save ✅
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('8%'),
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    margin: wp('2%'),
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('6%'),
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
    marginLeft: wp('2%'),
  },
  buttonTextLandscape: {
    fontSize: wp('3.5%'),
  },
});