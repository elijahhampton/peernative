import {Stack, Box} from 'native-base';
import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import DropDown from 'react-native-paper-dropdown';
import {TOPICS, LANGUAGE_LEVELS, LANGUAGES} from '../../constants/filters';
import {Button, Divider} from 'react-native-paper';
import {DeviceEventEmitter} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Globe from '../../components/animations/PulsatingCircle';
import RotatingLanguages from '../../components/animations/RotatingLanguages';
import WaveAnimation from '../../components/animations/DigitalWaveform';

interface IFilterState {
  desired_training_level: string;
  language: string;
  topic: string;
  target_language: string;
}

function Welcome() {
  const navigation = useNavigation();
  const [filters, setFilters] = useState<IFilterState>({
    desired_training_level: 'B2',
    language: 'English',
    target_language: 'Spanish',
    topic: TOPICS[0].value,
  });

  const [dropdownVisibilities, setDropdownVisibilities] = useState({
    desired_training_level: false,
    language: false,
    target_language: false,
    topic: false,
  });

  const onGetStarted = () => {
    DeviceEventEmitter.emit('new_filters', filters);
    navigation.navigate('Home');
  };

  useEffect(() => {
    return () => {
      DeviceEventEmitter.removeAllListeners('new_filters');
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
      }}>
      <Stack
        space={10}
        style={{
          flex: 1,
          paddingTop: 150,
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
        }}>
        {/* <Globe /> */}
        <WaveAnimation />
        <View style={{display: 'flex', alignItems: 'center'}}>
          <Text style={{paddingBottom: 10, fontSize: 20, fontWeight: '600'}}>
            Welcome to Peer Native
          </Text>
          <RotatingLanguages />
        </View>

        <Box>
          <Divider />
          <Text
            style={{
              fontSize: 12,
              color: '#757575',
              fontStyle: 'italic',
              letterSpacing: 0.5,
              lineHeight: 16,
              padding: 20,
              textAlign: 'center',
              textAlignVertical: 'center',
            }}>
            Peer Native works in a similar way to other messaging applications
            in the way you can chat with the AI as you talk with your friends.
          </Text>
        </Box>
      </Stack>

      <Button
        onPress={onGetStarted}
        style={{margin: 20, padding: 3, width: '90%'}}
        mode="contained">
        Have a conversation with Peer
      </Button>
    </SafeAreaView>
  );
}

export default Welcome;
