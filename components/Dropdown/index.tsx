import React, { useContext, useState, createContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

const DropdownContext = React.createContext();

const CustomDropdown = ({ label, options, onSelect }) => {
  const { openDropdown, setOpenDropdown } = useContext(DropdownContext);
  const isOpen = openDropdown === label;
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    onSelect(option);
    setOpenDropdown(null);
  };

  const toggleDropdown = () => {
    setOpenDropdown(isOpen ? null : label);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={toggleDropdown}
      >
        <Text style={styles.selectedText}>{selected?.label || 'Select...'}</Text>
      </TouchableOpacity>
      {isOpen && (
        <FlatList
          style={styles.expandedList}
          data={options}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.expandedItem}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.expandedText}>{item.label}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.value.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
  //  backgroundColor: '#fff',
    borderRadius: 3,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgb(248, 250 253)',
  },
  selectedText: {
    fontSize: 18,
  },
  expandedList: {
    backgroundColor: '#fff',
    borderRadius: 4,
    width: '100%',
    maxHeight: 200,
    marginTop: 0,
  },
  expandedItem: {
    padding: 16,
  },
  expandedText: {
    fontSize: 16,
  },
});

export { DropdownContext }
export default CustomDropdown;
