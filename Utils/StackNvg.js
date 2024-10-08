import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Pages/Home';
import AddRss from '../Pages/AddRss';
import FeedDetail from '../Pages/FeedDetail';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MyContext } from '../App';

const Stack = createStackNavigator();

export default function StackNvg() {
  const { isDarkMode, toggleDarkMode, headerColor, textColor } = useContext(MyContext);

  return (
    <Stack.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: headerColor,
        },
        headerTintColor: textColor,
      }}>
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('AddRss')} style={{ marginRight: 15 }}>
              <Icon name={'add'} size={24} color={textColor} />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={toggleDarkMode} style={{ marginLeft: 15 }}>
              <Icon name={isDarkMode ? 'sunny' : 'moon'} size={24} color={textColor} />
            </TouchableOpacity>
          ),
        })} 
      />
      <Stack.Screen name="AddRss" component={AddRss} options={{ headerTitle: 'Add RSS Feed' }} />
      <Stack.Screen name="FeedDetail" component={FeedDetail} 
        options={({ route }) => ({
          title: route.params?.title || 'Feed Detail',
        })} />
    </Stack.Navigator>
  );
}
