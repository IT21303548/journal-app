import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { JournalEntry } from '../types/journal';

export default function Dashboard() {
  const entries = useSelector((state: RootState) => state.journal.entries);
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

  const moodCounts = entries.reduce((acc: { [key: string]: number }, entry: JournalEntry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const entryFrequency = entries.reduce((acc: { [key: string]: number }, entry: JournalEntry) => {
    acc[entry.date] = (acc[entry.date] || 0) + 1;
    return acc;
  }, {});

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.header, isLandscape && styles.headerLandscape]}>Dashboard 📊</Text>

      <Animated.View entering={FadeInDown.duration(500)} style={styles.section}>
        <Text style={[styles.sectionTitle, isLandscape && styles.sectionTitleLandscape]}>
          Mood Trends 😊🌟
        </Text>
        {Object.keys(moodCounts).length > 0 ? (
          Object.entries(moodCounts).map(([mood, count]) => (
            <View key={mood} style={styles.trendItem}>
              <Text style={[styles.trendText, isLandscape && styles.trendTextLandscape]}>
                {mood}: {count} {count === 1 ? 'time' : 'times'} ⏰ Clock
              </Text>
              <LinearGradient
                colors={['#54d934', '#19490d']}
                style={[
                  styles.trendBar,
                  {
                    width: wp(
                      `${(count / entries.length) * (isLandscape ? 30 : 50)}%`
                    ),
                  },
                ]}
              />
            </View>
          ))
        ) : (
          <Text style={[styles.emptyText, isLandscape && styles.emptyTextLandscape]}>
            No mood data yet. Start journaling! 📝 
          </Text>
        )}
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(700)} style={styles.section}>
        <Text style={[styles.sectionTitle, isLandscape && styles.sectionTitleLandscape]}>
          Entry Frequency 📅📈 
        </Text>
        {Object.keys(entryFrequency).length > 0 ? (
          Object.entries(entryFrequency).map(([date, count]) => (
            <View key={date} style={styles.trendItem}>
              <Text style={[styles.trendText, isLandscape && styles.trendTextLandscape]}>
                {date}: {count} {count === 1 ? 'entry' : 'entries'} 📋 Clipboard
              </Text>
              <LinearGradient
                colors={['#54d934', '#19490d']}
                style={[
                  styles.trendBar,
                  {
                    width: wp(
                      `${
                        (count / Math.max(...Object.values(entryFrequency))) *
                        (isLandscape ? 30 : 50)
                      }%`
                    ),
                  },
                ]}
              />
            </View>
          ))
        ) : (
          <Text style={[styles.emptyText, isLandscape && styles.emptyTextLandscape]}>
            No entries yet. Add some! 📝 
          </Text>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#F3F4F6',
  },
  header: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  headerLandscape: {
    fontSize: wp('4%'),
  },
  section: {
    marginBottom: hp('3%'),
    backgroundColor: '#FFFFFF',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#135b02',
    marginBottom: hp('1%'),
  },
  sectionTitleLandscape: {
    fontSize: wp('4%'),
  },
  trendItem: {
    marginBottom: hp('1%'),
  },
  trendText: {
    fontSize: wp('4%'),
    color: '#2D2D2D',
  },
  trendTextLandscape: {
    fontSize: wp('3.5%'),
  },
  trendBar: {
    height: hp('1.5%'),
    borderRadius: wp('1%'),
    marginTop: hp('0.5%'),
  },
  emptyText: {
    fontSize: wp('4%'),
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyTextLandscape: {
    fontSize: wp('3.5%'),
  },
});