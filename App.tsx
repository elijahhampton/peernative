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
import {Input, HStack} from 'native-base';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  Button,
  MD3Colors,
  MD3LightTheme as DefaultTheme,
  Divider,
  Provider as PaperProvider,
  IconButton,
  Surface,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import {LinearGradientText} from 'react-native-linear-gradient-text';
import {NativeBaseProvider, Box} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Voice from '@react-native-community/voice';
import axios, {AxiosError, AxiosResponse} from 'axios';
Icon.loadFont();
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};

interface IResponse {
  response: string;
  role: string;
}

type PeerResponse = IResponse & {suggestion: string, error?: string};
type UserResponse = IResponse;

function App(): JSX.Element {
  const hasSessionStarted = useRef<any>(false);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<IResponse>>([]);

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

  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    handlePrompt();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

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
    const newUserResponse: UserResponse = {
      role: 'user',
      response: textInputVal,
    };
    setConversation(prevState => [...prevState, newUserResponse]);

    //make api request
    axios('http://localhost:3001/reply', {
      method: 'POST',
      data: textInputVal,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response: AxiosResponse<PeerResponse>) => {
        console.log('New ChatGPT Response: ');
        console.log(response.data);

        if (response.data?.error) {
          throw new Error(response.data?.error)
        }

        setConversation(prevState => [...prevState, response.data]);
      })
      .catch((error: AxiosError) => {
        console.log('Error with reply');
        console.log(error.message);
      });

    //parse gpt output
    //add to results { role: "peer", response: "", suggestion: "" } / { role: "user", response: "" }
  };

  const parseGPTOutput = () => {};

  const [textInputVal, setTextInputVal] = React.useState('');

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
    return <Box />;
  };

  const renderPeerResponse = (response: PeerResponse): JSX.Element => {
    return <Box />;
  };

  const renderSystemResponse = (response: IResponse): JSX.Element => {
    return <Box />;
  };

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
              <HStack space={1} alignItems="center" style={{}}>
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
                      disabled
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
