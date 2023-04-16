import {Stack} from 'native-base';
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import DropDown from 'react-native-paper-dropdown';
import {TOPICS, LANGUAGE_LEVELS, LANGUAGES} from '../../constants/filters';
import {Button} from 'react-native-paper';
import {DeviceEventEmitter} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface IFilterState {
  desired_training_level: string;
  language: string;
  topic: string;
  target_language: string;
}

function Welcome() {
    const navigation = useNavigation()
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
    navigation.navigate('Home')
  };

  useEffect(() => {
    return () => {
      DeviceEventEmitter.removeAllListeners('new_filters');
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          backgroundColor:
            'linear-gradient(90deg, rgba(123,192,246,1) 0%, rgba(255,255,255,1) 100%)',
        }}></View>

      <View
        style={{
          paddingTop: 15,
          paddingBottom: 15,
          flex: 1,
          backgroundColor: '#FFF',
        }}>
        <Stack space={8} style={{paddingLeft: 20, paddingRight: 20}}>
          <DropDown
            label={'Topic'}
            mode={'outlined'}
            visible={dropdownVisibilities['topic']}
            showDropDown={() => {
              setDropdownVisibilities({
                ...dropdownVisibilities,
                topic: true,
              });
            }}
            onDismiss={() => {
              setDropdownVisibilities({
                ...dropdownVisibilities,
                topic: false,
              });
            }}
            value={filters['topic']}
            setValue={value => {
              setFilters({
                ...filters,
                topic: value,
              });
            }}
            list={TOPICS}
          />

          <DropDown
            label={'Training Target'}
            mode={'outlined'}
            visible={dropdownVisibilities['desired_training_level']}
            showDropDown={() =>
              setDropdownVisibilities({
                ...dropdownVisibilities,
                desired_training_level: true,
              })
            }
            onDismiss={() =>
              setDropdownVisibilities({
                ...dropdownVisibilities,
                desired_training_level: false,
              })
            }
            value={filters['desired_training_level']}
            setValue={value =>
              setFilters({
                ...filters,
                desired_training_level: value,
              })
            }
            list={LANGUAGE_LEVELS}
          />

          <DropDown
            label={'Language'}
            mode={'outlined'}
            visible={dropdownVisibilities['language']}
            showDropDown={() =>
              setDropdownVisibilities({
                ...dropdownVisibilities,
                language: true,
              })
            }
            onDismiss={() =>
              setDropdownVisibilities({
                ...dropdownVisibilities,
                language: false,
              })
            }
            value={filters['language']}
            setValue={value =>
              setFilters({
                ...filters,
                language: value,
              })
            }
            list={LANGUAGES}
          />

          <DropDown
            label={'Target Language'}
            mode={'outlined'}
            visible={dropdownVisibilities['target_language']}
            showDropDown={() =>
              setDropdownVisibilities({
                ...dropdownVisibilities,
                target_language: true,
              })
            }
            onDismiss={() =>
              setDropdownVisibilities({
                ...dropdownVisibilities,
                target_language: false,
              })
            }
            value={filters['target_language']}
            setValue={value =>
              setFilters({
                ...filters,
                target_language: value,
              })
            }
            list={LANGUAGES}
          />
        </Stack>

        <Button
          onPress={onGetStarted}
          style={{margin: 20, padding: 3}}
          mode="contained">
          Get Started
        </Button>
      </View>
    </View>
  );
}

export default Welcome;
