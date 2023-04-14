//@ts-nocheck

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
  Avatar,
} from 'react-native-paper';
import {LinearGradientText} from 'react-native-linear-gradient-text';
import {NativeBaseProvider, Box, HStack, Stack, Input} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Voice from '@react-native-community/voice';
import axios, {AxiosError, AxiosResponse} from 'axios';

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import Conversation, {IResponse} from './components/Conversation';
import Appbar from './components/Appbar';
import FiltersDialog from './components/FiltersDialog';
import InputController from './components/InputController';
import queryClient from './react-query-index';
import { TOPICS, LANGUAGES, LANGUAGE_LEVELS } from './constants/filters';
import theme from './theme';
import { commonAxiosConfig } from './constants/api';

Icon.loadFont();

interface IFilterState {
  desired_training_level: string;
  language: string;
  topic: string;
  target_language: string;
}

function App(): JSX.Element {
  const [hasSessionStarted, setHasSessionStarted] = useState<boolean>(false);
  const [textInputVal, setTextInputVal] = React.useState('');

  const [conversation, setConversation] = useState<Array<IResponse>>([]);
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

 // const { data: {  greetingResponse: {role, content}, originalPrompt }, isLoading, error, isSuccess, mutate: handlePrompt, mutateAsync } = useSendGreetingWithTargets()

  const handlePrompt = (
    greeting,
    user_language,
    user_target_language,
    topic,
    training_level,
  ) => {


    setConversation(prevState => [
      ...prevState,
      {role: 'user', content: textInputVal},
    ]);


    const oldTextInputVal = textInputVal;


    clear();

    axios('http://localhost:3001/greeting', {
      method: 'POST',
      data: JSON.stringify({
        greeting,
        user_language,
        user_target_language,
        topic,
        training_level,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((axiosResponse: AxiosResponse<any, any>) => {
        let updatedChatGptCache = JSON.parse(JSON.stringify(conversationCache));
        let updatedConversation = JSON.parse(JSON.stringify(conversation));

        const {
          greetingResponse: {role, content},
          originalPrompt,
        } = axiosResponse.data;

        updatedChatGptCache.push({role: 'system', content: originalPrompt});

        const parsedContent = JSON.parse(content)[0];
        const {response, suggestion} = parsedContent;

        let error = '';
        if (parsedContent?.error) {
          error = parsedContent.error;
        }

        //@ts-ignore
        updatedConversation.push({ role: 'user', content: oldTextInputVal });
        updatedConversation.push({ role, response, suggestion, error });
        updatedChatGptCache.push({ role: 'assistant', content });

        setConversation([...updatedConversation]);
        setConversationCache([...updatedChatGptCache]);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  };

  const handleRespondToGpt = (myResponse: string) => {
    setThinking(true);
    axios(`http://localhost:3001/reply`, {
      ...commonAxiosConfig,
      data: JSON.stringify({
        userResponse: myResponse,
        pastConversation: conversationCache,
      }),
    })
      .then(axiosResponse => {
        const replyResponse = axiosResponse.data.replyResponse;
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
        });

        updatedConversation.push({
          role: 'system',
          response: parsedResponseContent[0]?.response,
          suggestion: parsedResponseContent[0]?.suggestion,
          error: newError,
        });

        setConversation([...updatedConversation]);
      })
      .catch(error => {
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

  return (
    <PaperProvider theme={theme}>
      <NativeBaseProvider>
        <QueryClientProvider client={queryClient}>
        <Appbar
          title="Peer Native"
          onShowFilters={showDialog}
          onRefresh={onRefreshSession}
        />

        <Box style={{flex: 1}}>
          <Box
            style={
              hasSessionStarted ? styles.sessionStarted : styles.sessionAwaiting
            }>
            {hasSessionStarted ? (
              <Conversation conversation={conversation} />
            ) : (
              <Box style={{padding: 15, textAlign: 'flex-start'}}>
                <Text variant="bodyLarge" style={{color: 'rgb(96, 108, 129)'}}>
                  Welcome to Peer Native. Customize your peer's settings and
                  start instantly. Display filter settings here?
                </Text>
              </Box>
            )}
          </Box>

          <Divider />
          <InputController
            inputVal={textInputVal}
            onChange={handleChangeTextInput}
            onSubmit={handleOnSubmit}
            onClearInput={clear}
            onSetInputVal={setTextInputVal}
          />
          {/* here */}
        </Box>

        <SafeAreaView />

        <FiltersDialog
          filters={filters}
          visible={filtersDialogIsVisible}
          onDismiss={() => setFiltersDialogIsVisible(false)}
          onSave={onSaveFilters}
        />
        </QueryClientProvider>
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
