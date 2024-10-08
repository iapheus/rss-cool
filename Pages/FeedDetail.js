import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Image, Button, Linking } from 'react-native';
import { MyContext } from '../App';
import { parse } from 'rss-to-json';

export default function FeedDetail({ route }) {
  const { isDarkMode, textColor, bgColor } = useContext(MyContext);
  const [feedItems, setFeedItems] = useState([]);
  const { rssUrl } = route.params;

  const convertTimestampToDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const rss = await parse(rssUrl);
        setFeedItems(rss.items);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch RSS feed.');
      }
    };

    fetchFeed();
  }, [rssUrl]);

  const renderFeedItem = ({ index, item }) => (
    <View style={[styles.feedItem, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <Image source={{ uri: item.media.thumbnail.url }}  height={200} width={'full'}></Image>
      <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
      <Text style={{ color: textColor }}>{item.description}</Text>
      <Text style={{ color: textColor, marginTop:5 }}>{convertTimestampToDate(item.published)}</Text>
      <Button onPress={() => Linking.openURL(item.link)} title="Read More"></Button>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <FlatList 
        data={feedItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderFeedItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  feedItem: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
