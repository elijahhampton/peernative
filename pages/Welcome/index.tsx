import {Stack } from 'native-base';
import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {Button } from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import RotatingLanguages from '../../components/animations/RotatingLanguages';
import WaveAnimation from '../../components/animations/DigitalWaveform';

function Welcome() {
  const navigation = useNavigation();

  const onGetStarted = () => {
    navigation.navigate('App');
  };

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
          style={{padding: 3, borderRadius: 30, width: '85%'}}
          mode="contained">
          Have a conversation with Peer
        </Button>
      </Stack>
    </SafeAreaView>
  );
}

export default Welcome;
