//@ts-nocheck
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect, useRef} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  useColorScheme,
  View,
  GestureResponderEvent,
} from 'react-native';

import {
  Button,
  MD3Colors,
  MD3LightTheme as DefaultTheme,
  Divider,
  Provider as PaperProvider,
  IconButton,
  Portal,
  Dialog,
  Surface,
  Text,
  TouchableRipple,
  TextInput,
} from 'react-native-paper';
import {LinearGradientText} from 'react-native-linear-gradient-text';
import {NativeBaseProvider, Box, HStack, Stack, Input} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Voice from '@react-native-community/voice';
import axios, {AxiosError, AxiosResponse} from 'axios';
import DropDown from 'react-native-paper-dropdown';

Icon.loadFont();

const theme = {
  ...DefaultTheme,
  version: 3,
  colors: {
    ...DefaultTheme.colors,
    primaryContainer: 'red',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: 'blue',
    secondary: 'yellow',
  },
};

interface IResponse {
  response: string;
  role: string;
}

type PeerResponse = IResponse & {suggestion: string; error?: string};
type UserResponse = IResponse;

interface IFilterState {
  desired_training_level: string;
  language: string;
}

const LANGUAGE_LEVELS = [
  {label: 'A1', value: 'A1'},
  {label: 'A2', value: 'A2'},
  {label: 'B1', value: 'B1'},
  {label: 'B2', value: 'B2'},
  {label: 'C1', value: 'C1'},
  {label: 'C2', value: 'C2'},
];
const LANGUAGES = [
  {label: 'English', value: 'english'},
  {label: 'Spanish', value: 'spanish'},
];

function App(): JSX.Element {
  const hasSessionStarted = useRef<any>(false);
  const [textInputVal, setTextInputVal] = React.useState('');
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<IResponse>>([]);
  const [conversationCache, setConversationCache] = useState<Array<any>>([]);
  const [filters, setFilters] = useState<IFilterState>({
    desired_training_level: 'B2',
    language: 'english',
    topic: '',
  });
  const [dropdownVisibilities, setDropdownVisibilities] = useState({
    desired_training_level: false,
    language: false,
  });
  const [filtersDialogIsVisible, setFiltersDialogIsVisible] =
    useState<boolean>(false);

  const showDialog = () => {
    setFiltersDialogIsVisible(true);
  };

  const hideDialog = () => setFiltersDialogIsVisible(false);

  const speechStartHandler = e => {
    console.log('speechStart successful', e);
  };

  const speechEndHandler = e => {
    setSpeaking(false);
    console.log('stop handler', e);
  };

  const speechResultsHandler = e => {
    const text = e.value[0];
    setTextInputVal(text);
  };

  const startRecording = async () => {
    setSpeaking(true);

    try {
      await Voice.start('en-Us');

      if (hasSessionStarted.current === false) {
        hasSessionStarted.current = true;
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setSpeaking(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  const clear = () => {
    setTextInputVal('');
  };

  const handlePrompt = () => {
    console.log('Prompting ChatGPT');
    axios('http://localhost:3001/greeting', {
      method: 'POST',
      data: textInputVal,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.status !== 200 || response.data !== true) {
          throw new Error('Error prompting AI');
        }

        console.log('Successfully prompted ChatGPT');
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  };

  const handleOnSubmit = (e: GestureResponderEvent) => {
    //add user response
    const userResponse: UserResponse = {
      role: 'user',
      response: textInputVal,
    };

    await axios(`http://localhost:3001/reply`, {
      ...commonAxiosConfig,
      data: JSON.stringify({
        userResponse,
        pastConversation: conversationCache,
      }),
    })
      .then(axiosResponse => {
        const replyResponse = axiosResponse.data.replyResponse;
        const responseContent = String(replyResponse.content).replace('.', '');
        const parsedResponseContent = JSON.parse(responseContent);
        const responseRole = replyResponse.role;

        const updatedConversationCache = JSON.parse(
          JSON.stringify(conversationCache),
        );

        updatedConversationCache.push({role: 'user', content: userResponse});
        updatedConversationCache.push({
          role: responseRole,
          content: responseContent,
        });

        let newError = '';
        if (parsedResponseContent[0]?.error) {
          newError = parsedResponseContent[0].error;
        }

        const updatedConversation = JSON.parse(JSON.stringify(conversation));

        updatedConversation.push({role: 'user', response: userResponse});
        updatedConversation.push({
          role: 'system',
          response: parsedResponseContent?.response,
          suggestion: parsedResponseContent?.suggestion,
          error: newError,
        });

        setConversation([...updatedConversation]);
      })
      .catch(error => {
        console.log(error?.message);
      });
  };

  const parseGPTOutput = () => {};

  const handleChangeTextInput = (text: string) => setTextInputVal(text);

  const renderResponse = (response: IResponse): JSX.Element => {
    switch (response.role) {
      case 'user':
        return renderUserResponse(response);
      case 'peer':
        return renderPeerResponse(response);
      case 'system':
        return renderSystemResponse(response);
      default:
        return <Box />;
    }
  };

  const renderUserResponse = (response: UserResponse): JSX.Element => {
    return <Text>{response?.response}</Text>;
  };

  const renderPeerResponse = (response: PeerResponse): JSX.Element => {
    return <Text>{response?.response}</Text>;
  };

  const renderSystemResponse = (response: IResponse): JSX.Element => {
    return <Text>{response?.response}</Text>;
  };

  const onRefreshSession = () => {
    setConversation([]);
    setConversationCache([]);
    handlePrompt();
    hideDialog();
  };

  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    //handlePrompt();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NativeBaseProvider>
        <SafeAreaView style={{backgroundColor: 'rgb(248, 250 253)'}} />
        <Box style={{flex: 1}}>
          <Box
            style={
              hasSessionStarted.current
                ? styles.sessionStarted
                : styles.sessionAwaiting
            }>
            {hasSessionStarted.current ? (
              <Box style={{flex: 1}}>
                <ScrollView>
                  {conversation.map((response: IResponse) =>
                    renderResponse(response),
                  )}
                </ScrollView>
              </Box>
            ) : (
              <Box style={{padding: 15, textAlign: 'center'}}>
                <LinearGradientText
                  colors={['#2196F3', '#9C27B0', '#B71C1C']}
                  text="Welcome to Peer Native"
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  textStyle={{fontSize: 30, paddingTop: 10, paddingBottom: 10}}
                />

                <Text variant="bodyLarge" style={{color: 'rgb(96, 108, 129)'}}>
                  Customize your peer's settings and begin a conversation
                </Text>
              </Box>
            )}
          </Box>
          <Divider />

          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={60}
            style={{width: '100%'}}>
            <Box
              style={{
                padding: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
              }}>
              <HStack space={2} alignItems="center" style={{}}>
                <Surface
                  elevation={0}
                  style={{
                    width: '100%',
                    borderWidth: 1,
                    borderColor: '#ddd',
                    flex: 1,
                    borderRadius: 20,
                  }}>
                  <Input
                    value={textInputVal}
                    w="100%"
                    onChangeText={handleChangeTextInput}
                    style={{width: '100%'}}
                    variant="unstyled"
                    placeholder="Start a conversation"
                  />
                </Surface>

                {textInputVal.length > 0 ? (
                  <IconButton
                    icon="send"
                    iconColor="#FFFFFF"
                    size={17}
                    style={{paddingLeft: 3, backgroundColor: '#1E88E5'}}
                    onPress={handleOnSubmit}
                  />
                ) : (
                  <>
                    <TouchableRipple>
                      <IconButton
                        onPress={
                          speaking
                            ? () => stopRecording()
                            : () => startRecording()
                        }
                        style={{marginLeft: 0, marginRight: 0}}
                        iconColor={speaking ? '#2196F3' : 'black'}
                        icon="microphone"
                        size={20}
                      />
                    </TouchableRipple>

                    <IconButton
                      onPress={showDialog}
                      style={{marginLeft: 0, marginRight: 0}}
                      icon="filter-variant"
                      iconColor="black"
                      size={20}
                    />
                  </>
                )}
              </HStack>
            </Box>
          </KeyboardAvoidingView>
        </Box>

        <SafeAreaView />

        <Dialog
          style={{borderRadius: 11}}
          visible={filtersDialogIsVisible}
          onDismiss={hideDialog}>
          <Dialog.Title>Modify Filters</Dialog.Title>
          <Dialog.Content>
            <Stack space={3}>
              <TextInput
                variant="outlined"
                label="Topic"
                value={filters['topic']}
                onChangeText={text =>
                  setFilters({
                    topic: filters['topic'],
                  })
                }
              />

              <DropDown
                label={'Training Target'}
                mode={'outlined'}
                visible={dropdownVisibilities['desired_training_level']}
                showDropDown={() =>
                  setDropdownVisibilities({
                    desired_training_level: true,
                  })
                }
                onDismiss={() =>
                  setDropdownVisibilities({
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
                    language: true,
                  })
                }
                onDismiss={() =>
                  setDropdownVisibilities({
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
            </Stack>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button
              onPress={onRefreshSession}
              compact
              style={{borderRadius: 2}}
              mode="contained">
              Refresh Session
            </Button>
          </Dialog.Actions>
        </Dialog>
      </NativeBaseProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  sessionStarted: {
    flex: 1,
    backgroundColor: 'rgb(248, 250 253)',
  },
  sessionAwaiting: {
    flex: 1,
    backgroundColor: 'rgb(248, 250 253)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
