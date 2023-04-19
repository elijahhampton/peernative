import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import CustomDropdown, { DropdownContext } from '../../components/Dropdown';

const AppSettings = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const topics = [
    { label: 'Topic 1', value: 1 },
    { label: 'Topic 2', value: 2 },
    { label: 'Topic 3', value: 3 },
  ];

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
  ];

  const languageLevels = [
    { label: 'Beginner', value: 1 },
    { label: 'Intermediate', value: 2 },
    { label: 'Advanced', value: 3 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <DropdownContext.Provider value={{ openDropdown, setOpenDropdown }}>
        <View style={styles.content}>
          <CustomDropdown
            label="Topic"
            options={topics}
            onSelect={(selected) => console.log('Topic selected:', selected)}
          />
          <CustomDropdown
            label="Language"
            options={languages}
            onSelect={(selected) => console.log('Language selected:', selected)}
          />
          <CustomDropdown
            label="Target Language"
            options={languages}
            onSelect={(selected) =>
              console.log('Target Language selected:', selected)
            }
          />
          <CustomDropdown
            label="Language Level"
            options={languageLevels}
            onSelect={(selected) =>
              console.log('Language Level selected:', selected)
            }
          />
        </View>
      </DropdownContext.Provider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default AppSettings;
