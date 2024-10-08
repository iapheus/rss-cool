import './gesture-handler';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNvg from './Utils/StackNvg';
import { createContext, useState } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const bgColor = isDarkMode ? '#141414' : '#fff';
  const headerColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';

  return (
    <MyContext.Provider value={{ bgColor, headerColor, textColor, isDarkMode, toggleDarkMode }}>
      {children}
    </MyContext.Provider>
  );
};

export default function App() {

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <MyProvider>
          <StackNvg />
        </MyProvider>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
