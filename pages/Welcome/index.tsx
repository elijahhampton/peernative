import {Stack, Box} from 'native-base';
import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import DropDown from 'react-native-paper-dropdown';
import {TOPICS, LANGUAGE_LEVELS, LANGUAGES} from '../../constants/filters';
import {Button, Divider} from 'react-native-paper';
import {DeviceEventEmitter} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RotatingLanguages from '../../components/animations/RotatingLanguages';
import WaveAnimation from '../../components/animations/DigitalWaveform';

interface IFilterState {
  desired_training_level: string;
  topic: string;
  target_language: string;
}

function Welcome() {
  const navigation = useNavigation();
  const [filters, setFilters] = useState<IFilterState>({
    desired_training_level: 'B2',
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
    navigation.navigate('Chat');
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
          width: '100%',
          position: 'relative',
          flex: 1,
          backgroundColor: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <WaveAnimation />
        <View style={{display: 'flex', alignItems: 'center'}}>
          <Text style={{paddingVertical: 10, fontSize: 20, fontWeight: '600'}}>
            Welcome to Peer Native
          </Text>
          <RotatingLanguages />
        </View>

        <Button
          onPress={onGetStarted}
          style={{padding: 3, borderRadius: 5, width: '85%'}}
          mode="contained">
          Have a conversation with Peer
        </Button>
      </Stack>
    </SafeAreaView>
  );
}

export default Welcome;
