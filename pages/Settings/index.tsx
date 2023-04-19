import {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Appbar, Button} from 'react-native-paper';
import {Box, Stack} from 'native-base';
import {LANGUAGES, LANGUAGE_LEVELS, TOPICS} from '../../constants/filters';
import React from 'react';
import DropDown from 'react-native-paper-dropdown';
import {DeviceEventEmitter} from 'react-native';
import {useNavigation} from '@react-navigation/native';

interface ISettingsProps {}

interface IFilterState {
  desired_training_level: string;
  language: string;
  topic: string;
  target_language: string;
}

function Settings(props: ISettingsProps) {
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

  const onSaveSessionFilters = () => {
    DeviceEventEmitter.emit('new_filters', filters);
    navigation.goBack();
  };

  useEffect(() => {
    return () => {
      DeviceEventEmitter.removeAllListeners('new_filters');
    };
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'rgb(248, 250 253)'}}>
      <Appbar style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Settings"
          titleStyle={styles.title}
          style={styles.content}
        />
      </Appbar>
      <View style={{flex: 1, display: 'flex', justifyContent: 'space-between'}}>
        <Stack space={8} style={{paddingLeft: 20, paddingRight: 20}}>
          <DropDown
            dropDownItemStyle={{
              backgroundColor: '#FFFFFF',
            }}
            dropDownItemSelectedStyle={{
              backgroundColor: '#FFFFFF',
            }}
            dropDownStyle={{
              backgroundColor: '#FFFFFF',
            }}
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
            dropDownItemStyle={{
              backgroundColor: '#FFFFFF',
            }}
            dropDownItemSelectedStyle={{
              backgroundColor: '#FFFFFF',
            }}
            dropDownStyle={{
              backgroundColor: '#FFFFFF',
            }}
            style={{backgroundColor: '#FFFFFF'}}
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
            dropDownItemStyle={{
              backgroundColor: '#FFFFFF',
            }}
            dropDownItemSelectedStyle={{
              backgroundColor: '#FFFFFF',
            }}
            dropDownStyle={{
              backgroundColor: '#FFFFFF',
            }}
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
            dropDownItemStyle={{
              backgroundColor: '#FFFFFF',
            }}
            dropDownItemSelectedStyle={{
              backgroundColor: '#FFFFFF',
            }}
            dropDownStyle={{
              backgroundColor: '#FFFFFF',
            }}
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
          onPress={onSaveSessionFilters}
          mode="contained"
          style={{marginBottom: 20, width: '90%', alignSelf: 'center'}}>
          Save
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: '800',
  },
  header: {
    display: 'flex',
    backgroundColor: 'rgb(248, 250 253)',
  },
});

export default Settings;
