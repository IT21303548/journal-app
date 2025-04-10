// app/dashboard.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { JournalEntry } from '../types/journal';
import { RootState } from '../redux/store';

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

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isLandscape && styles.sectionTitleLandscape]}>
          Mood Trends
        </Text>
        {Object.keys(moodCounts).length > 0 ? (
          Object.entries(moodCounts).map(([mood, count]) => (
            <View key={mood} style={styles.trendItem}>
              <Text style={[styles.trendText, isLandscape && styles.trendTextLandscape]}>
                {mood}: {count} {count === 1 ? 'time' : 'times'}
              </Text>
              <View
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
            No mood data yet.
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isLandscape && styles.sectionTitleLandscape]}>
          Entry Frequency
        </Text>
        {Object.keys(entryFrequency).length > 0 ? (
          Object.entries(entryFrequency).map(([date, count]) => (
            <View key={date} style={styles.trendItem}>
              <Text style={[styles.trendText, isLandscape && styles.trendTextLandscape]}>
                {date}: {count} {count === 1 ? 'entry' : 'entries'}
              </Text>
              <View
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
            No entries yet.
          </Text>
        )}
      </View>
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
  },
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#6B48FF',
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
    height: hp('1%'),
    backgroundColor: '#6B48FF',
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