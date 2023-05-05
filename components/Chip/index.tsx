import { memo } from 'react';
import { Text } from 'react-native-paper';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';

interface ChipProps {
  label: string;
  onPress: () => void;
}

const Chip = memo(({ label, onPress }: ChipProps): JSX.Element => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <LinearGradient
        colors={['#1e90ff', '#87CEFA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.chip}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  chip: {
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  label: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'System',
  },
});

export default Chip;
