import { memo } from 'react';
import { Appbar as PaperAppbar, Text } from 'react-native-paper';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { HStack, Stack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import LinearGradientText from 'react-native-linear-gradient';
import React from 'react';
import Chip from '../Chip';

interface AppbarProps {
  onShowFilters: () => void;
  title: string;
  onRefresh: () => void;
}

const Appbar = memo(
  ({ onShowFilters, title, onRefresh, filters }: AppbarProps): JSX.Element => {
    const navigation = useNavigation();

    return (
      <Stack>
        <HStack style={styles.header}>
          <Text style={styles.headerText}>Conversation</Text>

          <HStack>
            <PaperAppbar.Action
              icon="refresh"
              size={22}
              onPress={onRefresh}
            />
          </HStack>
        </HStack>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <HStack
            space={2}
            style={{ paddingBottom: 10, paddingHorizontal: 20 }}
          >
            <Chip
              label={`Topic: ${filters['topic'].charAt(0).toUpperCase() + filters['topic'].slice(1)}`}
              onPress={() => navigation.navigate('Settings')}
            />
            <Chip
              label={`Language: ${filters['target_language']}`}
              onPress={() => navigation.navigate('Settings')}
            />
          </HStack>
        </ScrollView>
      </Stack>
    );
  }
);

const styles = StyleSheet.create({
  linearGradientTextStyles: {
    fontSize: 26,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: '600',
  },
  header: {
    paddingLeft: 20,
    margin: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold'
  }
});

export default Appbar;
