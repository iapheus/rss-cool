import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Alert, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Modal 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MyContext } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddRss() {
  const { isDarkMode, textColor, bgColor } = useContext(MyContext);
  const [rssUrl, setRssUrl] = useState('');
  const [fetchInterval, setFetchInterval] = useState('5');
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');

  const validateUrl = (url) => {
    const pattern = /^(http|https):\/\/[^\s$.?#].[^\s]*$/;
    return pattern.test(url);
  };

  const handleAddRss = async () => {
    if (!rssUrl || !title) {
      Alert.alert('Error', 'Please enter both a title and an RSS URL.');
      return;
    }
    
    if (!validateUrl(rssUrl)) {
      Alert.alert('Error', 'Please enter a valid URL.');
      return;
    }

    try {
      const rssFeeds = await AsyncStorage.getItem('rssFeeds');
      const updatedFeeds = rssFeeds ? JSON.parse(rssFeeds) : [];
      updatedFeeds.push({ url: rssUrl, interval: fetchInterval, title });

      await AsyncStorage.setItem('rssFeeds', JSON.stringify(updatedFeeds));
      Alert.alert('Success', 'RSS URL added successfully.');

      setRssUrl('');
      setTitle('');
    } catch (error) {
      Alert.alert('Error', 'An error occurred while adding the RSS URL.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <Text style={[styles.title, { color: textColor }]}>Add RSS Feed</Text>

        {/* Title input */}
        <TextInput
          style={[styles.input, { backgroundColor: isDarkMode ? '#333' : '#fff', color: textColor }]}
          placeholder="Enter Feed Title"
          placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
          value={title}
          onChangeText={setTitle}
        />

        {/* RSS URL input */}
        <TextInput
          style={[styles.input, { backgroundColor: isDarkMode ? '#333' : '#fff', color: textColor }]}
          placeholder="Enter RSS Feed URL"
          placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
          value={rssUrl}
          onChangeText={setRssUrl}
        />

        <Text style={[styles.label, { color: textColor }]}>Fetch Interval (minutes):</Text>

        {/* Area to open the Picker */}
        <TouchableOpacity style={styles.pickerToggle} onPress={() => setModalVisible(true)}>
          <Text style={[styles.pickerText, { color: textColor }]}>Every {fetchInterval} minutes</Text>
        </TouchableOpacity>

        {/* Picker inside Modal */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.pickerContainer, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
              <Picker
                selectedValue={fetchInterval}
                onValueChange={(itemValue) => {
                  setFetchInterval(itemValue);
                  setModalVisible(false);
                }}
              >
                <Picker.Item label="1" value="1" />
                <Picker.Item label="5" value="5" />
                <Picker.Item label="10" value="10" />
                <Picker.Item label="15" value="15" />
              </Picker>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={[styles.closeModalText, { color: isDarkMode ? '#bb86fc' : '#6200ee' }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: isDarkMode ? '#bb86fc' : '#6200ee' }]} 
          onPress={handleAddRss}
        >
          <Text style={styles.buttonText}>Add RSS</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    fontWeight: '700',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  label: {
    marginBottom: 10,
    fontSize: 18,
  },
  pickerToggle: {
    width: '100%',
    padding: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  pickerText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeModalText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
