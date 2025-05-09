import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import JournalForm from '../assets/components/JournalForm';
import { addEntry, deleteEntry, updateEntry } from '../redux/journalSlice';
import { AppDispatch, RootState } from '../redux/store';
import { JournalEntry } from '../types/journal';

type JournalCardProps = {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
};

const JournalCard: React.FC<JournalCardProps> = React.memo(({ entry, onEdit, onDelete }) => {
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

  const moodColors: { [key: string]: string } = {
    '😊': '#6B48FF',
    '😢': '#FF5A5F',
    '😡': '#FF5A5F',
    '😴': '#A0A0A0',
    '🤩': '#FFD60A',
    '😂': '#FFD60A',
    '😍': '#FF5A5F',
    '😱': '#FF5A5F',
    '🤔': '#A0A0A0',
    '😎': '#6B48FF',
    '🥳': '#FFD60A',
    '😞': '#FF5A5F',
    '🤗': '#FFD60A',
    '😜': '#FFD60A',
    '🤯': '#FF5A5F',
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      style={[
        styles.card,
        isLandscape && styles.cardLandscape,
        { borderLeftColor: moodColors[entry.mood] || '#6B48FF', borderLeftWidth: 5 },
      ]}
    >
      <Text style={[styles.date, isLandscape && styles.dateLandscape]}>📅  {entry.date}</Text>
      <Text style={[styles.text, isLandscape && styles.textLandscape]}>💭  {entry.text}</Text>
      <Text style={[styles.mood, isLandscape && styles.moodLandscape]}>Mood: {entry.mood} 🌟</Text>
      {entry.image && (
        <Image
          source={{ uri: entry.image }}
          style={[styles.image, isLandscape && styles.imageLandscape]}
        />
      )}
      <View style={styles.cardButtons}>
        <TouchableOpacity onPress={() => onEdit(entry)} style={styles.editButton}>
          <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>Edit ✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(entry.id)} style={styles.deleteButton}>
          <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>Delete 🗑️</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

export default function Journal() {
  const dispatch = useDispatch<AppDispatch>();
  const entries = useSelector((state: RootState) => state.journal.entries);
  const { openForm } = useLocalSearchParams<{ openForm?: string }>();
  const [modalVisible, setModalVisible] = React.useState(openForm === 'true');
  const [editEntry, setEditEntry] = React.useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
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

  React.useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    loadData();
  }, []);

  React.useEffect(() => {
    if (openForm === 'true') {
      setModalVisible(true);
    }
  }, [openForm]);

  const groupedEntries = entries.reduce((acc: { [key: string]: JournalEntry[] }, entry: JournalEntry) => {
    const date = entry.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  const sections = Object.keys(groupedEntries)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .map((date) => ({
      title: date,
      data: groupedEntries[date],
    }));

  const handleEdit = (entry: JournalEntry) => {
    setEditEntry(entry);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteEntry(id));
  };

  const handleSave = (entry: JournalEntry) => {
    dispatch(entry.id === editEntry?.id ? updateEntry(entry) : addEntry(entry));
    setModalVisible(false);
    setEditEntry(null);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditEntry(null);
  };

  const renderItem = ({ item }: { item: JournalEntry }) => (
    <JournalCard entry={item} onEdit={handleEdit} onDelete={handleDelete} />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B48FF" />
        <Text style={[styles.loadingText, isLandscape && styles.loadingTextLandscape]}>
          Loading your journal... ⏳ Hourglass
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        renderItem={({ item }) => (
          <View>
            <Text style={[styles.sectionHeader, isLandscape && styles.sectionHeaderLandscape]}>
              📅 {item.title}
            </Text>
            <FlatList
              data={item.data}
              renderItem={renderItem}
              keyExtractor={(entry) => entry.id}
              numColumns={isLandscape ? 2 : 1}
            />
          </View>
        )}
        keyExtractor={(section) => section.title}
        key={isLandscape ? 'landscape' : 'portrait'}
        ListEmptyComponent={
          <Text style={[styles.emptyText, isLandscape && styles.emptyTextLandscape]}>
            No entries yet. Add one! 📝 Pencil
          </Text>
        }
      />
      {modalVisible && (
        <View style={styles.modalContainer}>
          <JournalForm entry={editEntry} onSave={handleSave} onCancel={handleCancel} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    fontSize: wp('4%'),
    color: '#6B7280',
    marginTop: hp('2%'),
  },
  loadingTextLandscape: {
    fontSize: wp('3.5%'),
  },
  sectionHeader: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginVertical: hp('1%'),
    color: '#2D2D2D',
    backgroundColor: '#FFFFFF',
    padding: wp('2%'),
    borderRadius: wp('2%'),
  },
  sectionHeaderLandscape: {
    fontSize: wp('4%'),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1%'),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: wp('1%'),
  },
  cardLandscape: {
    width: wp('45%'),
    margin: wp('2%'),
  },
  date: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#6B48FF',
  },
  dateLandscape: {
    fontSize: wp('3.5%'),
  },
  text: {
    fontSize: wp('4%'),
    color: '#2D2D2D',
    marginVertical: hp('1%'),
  },
  textLandscape: {
    fontSize: wp('3.5%'),
  },
  mood: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
  },
  moodLandscape: {
    fontSize: wp('3%'),
  },
  image: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('2%'),
    marginVertical: hp('1%'),
  },
  imageLandscape: {
    width: wp('15%'),
    height: wp('15%'),
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: hp('1%'),
  },
  editButton: {
    backgroundColor: '#135b02',
    padding: wp('2%'),
    borderRadius: wp('2%'),
    marginLeft: wp('2%'),
  },
  deleteButton: {
    backgroundColor: '#FF5A5F',
    padding: wp('2%'),
    borderRadius: wp('2%'),
    marginLeft: wp('2%'),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: wp('3.5%'),
  },
  buttonTextLandscape: {
    fontSize: wp('3%'),
  },
  emptyText: {
    fontSize: wp('4%'),
    color: '#6B7280',
    textAlign: 'center',
    marginTop: hp('5%'),
  },
  emptyTextLandscape: {
    fontSize: wp('3.5%'),
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});