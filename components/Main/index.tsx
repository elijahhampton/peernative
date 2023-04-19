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
  Alert,
  Dimensions,
  Text,
} from 'react-native';

import {Divider} from 'react-native-paper';
import {LinearGradientText} from 'react-native-linear-gradient-text';
import {NativeBaseProvider, Box, HStack, Stack, Input, Button} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Voice from '@react-native-community/voice';
import axios, {AxiosError, AxiosResponse} from 'axios';

import {commonAxiosConfig} from '../../constants/api';
import Appbar from '../Appbar';
import Conversation from '../Conversation';
import {
  useSendGreetingWithTargets,
  useSendResponse,
} from '../../hooks/mutations';
import {TOPICS} from '../../constants/filters';
import InputController from '../InputController';
import FiltersDialog from '../FiltersDialog';
import {StackRouter, useNavigation} from '@react-navigation/native';
import {DeviceEventEmitter} from 'react-native';

Icon.loadFont();

interface IFilterState {
  desired_training_level: string;
  language: string;
  topic: string;
  target_language: string;
}

function Main(): JSX.Element {
  const [hasSessionStarted, setHasSessionStarted] = useState<boolean>(false);
  const [textInputVal, setTextInputVal] = React.useState('');

  const [conversation, setConversation] = useState<Array<any>>([]);
  const [conversationCache, setConversationCache] = useState<Array<any>>([]);

  const [filters, setFilters] = useState<IFilterState>({
    desired_training_level: 'B2',
    language: 'English',
    target_language: 'Spanish',
    topic: TOPICS[0].value,
  });

  const [filtersDialogIsVisible, setFiltersDialogIsVisible] =
    useState<boolean>(false);

  const showDialog = () => {
    setFiltersDialogIsVisible(true);
  };

  const hideDialog = () => setFiltersDialogIsVisible(false);

  const clear = () => {
    setTextInputVal('');
  };

  const [thinking, setThinking] = useState<boolean>(false);

  const {
    isLoading,
    error,
    isSuccess,
    mutate: onPrompt,
    mutateAsync: onPromptAsync,
  } = useSendGreetingWithTargets();
  const {
    data: gptResponse,
    mutate: onRespond,
    mutateAsync: onRespondAsync,
  } = useSendResponse();

  const handlePrompt = (
    greeting: string,
    user_language: string,
    user_target_language: string,
    topic: string,
    training_level: string,
  ) => {
    const userTimestamp = new Date();

    setConversation((prevState: any) => [
      ...prevState,
      {role: 'user', content: textInputVal, timestamp: userTimestamp},
      {role: 'assistant', content: '', isLoading: true},
    ]);

    const oldTextInputVal = textInputVal;

    clear();

    onPromptAsync({
      greeting,
      user_language,
      user_target_language,
      topic,
      training_level,
    })
      .then((axiosResponse: any) => {
        let updatedChatGptCache = JSON.parse(JSON.stringify(conversationCache));
        let updatedConversation = JSON.parse(JSON.stringify(conversation));

        const {
          greetingResponse: {role, content},
          originalPrompt,
          timestamp,
        } = axiosResponse;

        updatedChatGptCache.push({role: 'system', content: originalPrompt});

        const parsedContent = JSON.parse(content)[0];
        const {response, suggestion} = parsedContent;

        let error = '';
        if (parsedContent?.error) {
          error = parsedContent.error;
        }

        //@ts-ignore
        updatedConversation.push({
          role: 'user',
          content: oldTextInputVal,
          timestamp: userTimestamp,
        });
        updatedConversation.push({
          role,
          response,
          suggestion,
          error,
          timestamp: timestamp,
        });
        updatedChatGptCache.push({role: 'assistant', content});

        setConversation([...updatedConversation]);
        setConversationCache([...updatedChatGptCache]);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  const handleRespondToGpt = (myResponse: string) => {
    const userTimestamp = new Date();

    setConversation((prevState: any) => [
      ...prevState,
      {role: 'assistant', content: '', isLoading: true},
    ]);

    setThinking(true);

    onRespondAsync({
      response: myResponse,
      pastConversation: conversationCache,
    })
      .then((axiosResponse: any) => {
        const gptTimestamp = axiosResponse?.timestamp;
        const replyResponse = axiosResponse?.replyResponse;
        const responseContent = String(replyResponse.content).replace('.', '');
        const parsedResponseContent = JSON.parse(responseContent);
        const responseRole = replyResponse.role;
        let updatedConversation = JSON.parse(JSON.stringify(conversation));
        let updatedConversationCache = JSON.parse(
          JSON.stringify(conversationCache),
        );

        updatedConversationCache.push({role: 'user', content: myResponse});
        updatedConversationCache.push({
          role: responseRole,
          content: responseContent,
        });

        let newError = '';
        if (parsedResponseContent[0]?.error) {
          newError = parsedResponseContent[0].error;
        }

        updatedConversation.push({
          role: 'user',
          content: myResponse,
          timestamp: userTimestamp,
        });

        updatedConversation.push({
          role: 'system',
          response: parsedResponseContent[0]?.response,
          suggestion: parsedResponseContent[0]?.suggestion,
          error: newError,
          timestamp: gptTimestamp,
        });

        setConversation([...updatedConversation]);
      })
      .catch((error: AxiosError) => {
        console.log(error?.message);
      })
      .finally(() => {
        setThinking(false);
      });
  };

  const updateConversationFromUser = async () => {
    let updatedConversation = JSON.parse(JSON.stringify(conversation));
    updatedConversation.push({role: 'user', content: textInputVal});
    setConversation([...updatedConversation]);
    clear();
  };

  const handleOnSubmit = () => {
    if (hasSessionStarted === false) {
      onStartNewSession();
      return;
    }

    updateConversationFromUser().then(() => {
      handleRespondToGpt(textInputVal);
      clear();
    });
  };

  const onStartNewSession = () => {
    const newResponse: string = textInputVal + '"';

    setConversation([]);
    setConversationCache([]);
    setHasSessionStarted(true);

    handlePrompt(
      newResponse,
      filters['language'],
      filters['target_language'],
      filters['topic'],
      filters['desired_training_level'],
    );
  };

  const handleChangeTextInput = (text: string) => setTextInputVal(text);

  const onRefreshSession = () => {
    setHasSessionStarted(false);
    setConversation([]);
    setConversationCache([]);
  };

  const onSaveFilters = () => {
    hideDialog();
    setHasSessionStarted(false);
    setConversation([]);
    setConversationCache([]);
  };

  const navigation = useNavigation();

  DeviceEventEmitter.addListener('new_filters', eventData => {
    setFilters({...eventData});
    onRefreshSession();
    navigation.navigate('Home');
  });

  return (
    //@ts-ignore
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <Appbar
        title="Peer"
        onShowFilters={/*showDialog*/ () => navigation.navigate('Settings')}
        onRefresh={onRefreshSession}
      />

      <Box style={{flex: 1}}>
        <Box
          style={
            hasSessionStarted ? styles.sessionStarted : styles.sessionAwaiting
          }>
            {
              hasSessionStarted ?
              <Conversation
              filters={filters}
              conversation={conversation}
              sessionStarted={hasSessionStarted}
            />
              :
              <View style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stack space={5} style={{  borderRadius: 8, backgroundColor: '#f2f2f2', padding: 30 }}>
                  <Text style={{ color: "#212121" }}>Get started with peer by sending a message or changing the applied settings.</Text>
                  <Button onPress={() => navigation.navigate('Settings')} style={{ backgroundColor: '#42A5F5' }}>Change settings</Button>
              </Stack>
              </View>
    
            }

        </Box>

        <Divider />
        <InputController
          inputVal={textInputVal}
          onChange={handleChangeTextInput}
          onSubmit={handleOnSubmit}
          onClearInput={clear}
          onSetInputVal={setTextInputVal}
        />
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sessionStarted: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  sessionAwaiting: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});

export default Main;
