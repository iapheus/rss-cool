import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Button } from 'react-native';
import { MyContext } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({ navigation }) {
  const { isDarkMode, textColor, bgColor } = useContext(MyContext);
  const [rssFeeds, setRssFeeds] = useState([]);

  useEffect(() => {
    const loadFeeds = async () => {
      try {
        const storedFeeds = await AsyncStorage.getItem('rssFeeds');
        if (storedFeeds) {
          setRssFeeds(JSON.parse(storedFeeds));
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load feeds from storage.');
      }
    };

    loadFeeds();
  }, []);

  const renderFeed = ({ item }) => (
    <TouchableOpacity 
      style={[styles.feedItem, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}
      onPress={() => navigation.navigate('FeedDetail', { rssUrl: item.url, title: item.title })}
    >
      <Text style={{ color: textColor }}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Your RSS Feeds</Text>
      {/* <Button onPress={() => (AsyncStorage.removeItem('rssFeeds'))} title="Clear all"></Button> */}
      <FlatList 
        data={rssFeeds}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderFeed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  feedItem: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
