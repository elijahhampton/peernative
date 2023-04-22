import {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {Appbar, Button} from 'react-native-paper';
import {Box, Stack, HStack} from 'native-base';
import {LANGUAGES, LANGUAGE_LEVELS, TOPICS} from '../../constants/filters';
import React from 'react';
import DropDown from 'react-native-paper-dropdown';
import {DeviceEventEmitter} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Linking} from 'react-native';

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

  const openURL = async url => {
    // Check if the provided URL can be opened
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      // Open the URL in the system browser
      Linking.openURL(url);
    } else {
      // Show an error message if the URL cannot be opened
      Alert.alert('Error', 'Unable to open the URL');
    }
  };

  useEffect(() => {
    return () => {
      DeviceEventEmitter.removeAllListeners('new_filters');
    };
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <Appbar style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Settings"
          titleStyle={styles.title}
          style={styles.content}
        />
      </Appbar>
      <View style={{flex: 1, display: 'flex', justifyContent: 'space-between'}}>
        <View style={styles.padding10}>
          <Stack space={8} style={styles.paddingLeftRight20}>
            <HStack
              space={4}
              alignItems="center"
              justifyContent="space-between">
              <Box style={{flex: 1}}>
                <DropDown
                  dropDownItemStyle={styles.bgcolorWhite}
                  dropDownItemSelectedStyle={styles.bgcolorWhite}
                  dropDownStyle={styles.bgcolorWhite}
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
              </Box>

              <Box style={{flex: 1}}>
                <DropDown
                  dropDownItemStyle={styles.bgcolorWhite}
                  dropDownItemSelectedStyle={styles.bgcolorWhite}
                  dropDownStyle={styles.bgcolorWhite}
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
              </Box>
            </HStack>

            <Box>
              <DropDown
                dropDownItemStyle={styles.bgcolorWhite}
                dropDownItemSelectedStyle={styles.bgcolorWhite}
                dropDownStyle={styles.bgcolorWhite}
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
              <HStack
                space={1}
                alignItems="center"
                style={styles.helperTextContainer}>
                <Icon name="ios-information-circle-outline" />
                <Text
                  style={styles.helperText}
                  onPress={() =>
                    openURL(
                      'https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale',
                    )
                  }>
                  Levels are based on the CEFR levels
                </Text>
              </HStack>
            </Box>

            <DropDown
              dropDownItemStyle={styles.bgcolorWhite}
              dropDownItemSelectedStyle={styles.bgcolorWhite}
              dropDownStyle={styles.bgcolorWhite}
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
          </Stack>
        </View>

        <Button
          onPress={onSaveSessionFilters}
          mode="contained"
          style={[
            styles.marginBottom20,
            styles.width90,
            styles.alignSelfCenter,
          ]}>
          Save
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  marginBottom20: {
    marginBottom: 20,
  },
  width90: {
    width: '90%',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  content: {
    alignSelf: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: '800',
  },
  header: {
    display: 'flex',
    backgroundColor: '#FFF',
  },
  helperTextContainer: {
    paddingTop: 5,
  },
  helperText: {
    fontSize: 12,
    color: '#1E88E5',
  },
  bgcolorWhite: {
    backgroundColor: '#FFFFFF',
  },
  paddingLeftRight20: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  padding10: {
    padding: 10,
  },
});

export default Settings;
