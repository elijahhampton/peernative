import React, {useCallback, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';

import {Divider, Button} from 'react-native-paper';
import {Box, Stack} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {AxiosError} from 'axios';

import Appbar from '../Appbar';
import Conversation from '../Conversation';
import {
  useSendGreetingWithTargets,
  useSendResponse,
} from '../../hooks/mutations';
import {TOPICS} from '../../constants/filters';
import InputController from '../InputController';
import {useNavigation} from '@react-navigation/native';
import {DeviceEventEmitter} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import ISO6391 from 'iso-639-1';
import { IFilterState } from '../../types';

Icon.loadFont();

interface IChatMessage {
  role: 'assistant' | 'system' | 'user';
  content: string;
  response?: string;
  suggestion?: string;
  error?: string;
  timestamp?: string;
}

function Main(): JSX.Element {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;

  const navigation = useNavigation();
  const [hasSessionStarted, setHasSessionStarted] = useState<boolean>(false);
  const [textInputVal, setTextInputVal] = useState<string>('');
  const [conversation, setConversation] = useState<IChatMessage[]>([]);
  const [conversationCache, setConversationCache] = useState<IChatMessage[]>([]);

  const [filters, setFilters] = useState<IFilterState>({
    target_language: 'Spanish',
    topic: TOPICS[0].value,
  });
 
  const clear = useCallback(() => {
    setTextInputVal('');
  }, [])

  const {mutateAsync: onPromptAsync} =
    useSendGreetingWithTargets();

  const {
    mutateAsync: onRespondAsync,
  } = useSendResponse();

  const handlePrompt = (
    greeting: string,
    user_target_language: string,
    topic: string,
  ) => {
    const userTimestamp = new Date();

    setConversation([
      {role: 'user', content: textInputVal, timestamp: userTimestamp},
      {role: 'assistant', content: '', isLoading: true},
    ]);

    clear();

    onPromptAsync({
      greeting,
      user_language: deviceLanguage,
      user_target_language,
      topic,
      training_level: 'C1',
    })
      .then((axiosResponse: any) => {
        let updatedChatGptCache = JSON.parse(JSON.stringify(conversationCache));
        let updatedConversation = [] 
        
        const {
          greetingResponse: {role, content},
          originalPrompt,
          timestamp,
        } = axiosResponse;
        
        updatedChatGptCache.push({role: 'system', content: originalPrompt});

        const parsedContent = content.split("|");
        const [response, suggestion] = parsedContent;

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
          error: "",
          timestamp: timestamp,
        });
        updatedChatGptCache.push({role: 'assistant', content});

       //@ts-ignore
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

    onRespondAsync({
      response: myResponse,
      pastConversation: conversationCache,
    })
      .then((axiosResponse: any) => {
        const gptTimestamp = axiosResponse?.timestamp;
        const replyResponse = axiosResponse?.replyResponse;
        
        const { role, content } = replyResponse
        const parsedContent = content.split("|");
        const [response, suggestion] = parsedContent;

        let updatedConversation = JSON.parse(JSON.stringify(conversation));
        let updatedConversationCache = JSON.parse(
          JSON.stringify(conversationCache),
        );

        updatedConversationCache.push({role: 'user', content: myResponse});
        updatedConversationCache.push({
          role,
          content: response,
        });

        updatedConversation.push({
          role: 'user',
          content: myResponse,
          timestamp: userTimestamp,
        });

        updatedConversation.push({
          role: 'system',
          response,
          suggestion,
          error: "",
          timestamp: gptTimestamp,
        });

        setConversation([...updatedConversation]);
      })
      .catch((error: AxiosError) => {
        console.log(error?.message);
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
      filters['target_language'],
      filters['topic']
    );
  };

  const handleChangeTextInput = (text: string) => setTextInputVal(text);

  const onRefreshSession = useCallback(() => {
    setHasSessionStarted(false);
    setConversation([]);
    setConversationCache([]);
  }, [])

  DeviceEventEmitter.addListener('new_filters', eventData => {
    setFilters({...eventData});
    onRefreshSession();
    navigation.navigate('Home');
  });

  return (
    //@ts-ignore
    <View style={styles.container}>
      <SafeAreaView
        style={{
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 4,
        }}
      />
      <Appbar
        filters={filters}
        title="Conversation"
        onShowFilters={() => navigation.navigate('Settings')}
        onRefresh={onRefreshSession}
      />
      <Divider />

      <Box style={styles.container}>
        <Box
          style={
            hasSessionStarted ? styles.sessionStarted : styles.sessionAwaiting
          }>
          {hasSessionStarted ? (
            <Conversation
              conversation={conversation}
              sessionStarted={hasSessionStarted}
            />
          ) : (
            <View style={styles.sessionAwaitingContainer}>
              <Stack space={5} style={styles.directionalContainer}>
                <Stack space={3} style={styles.directionalTextContainer}>
                  <Text style={styles.directionalTextTitle}>
                    Configure your settings ⚙️
                  </Text>
                  <Text style={styles.directionalText}>
                    Review the current configurations (in the app bar) and
                    change if necessary
                  </Text>
                </Stack>

                <Stack space={3} style={styles.directionalTextContainer}>
                  <Text style={styles.directionalTextTitle}>
                    Send your first message 💬
                  </Text>
                  <Text style={styles.directionalText}>
                    Choose a target language and topic.
                  </Text>
                  <Stack space={1}>
                    <Text
                      style={{
                        fontSize: 12,
                        textAlign: 'center',
                        color: 'rgb(82, 87, 116)',
                      }}>
                      Note: Your language is set to {ISO639.getName(deviceLanguage)}.
                    </Text>

                    <Text
                      style={{
                        fontSize: 12,
                        textAlign: 'center',
                        color: 'rgb(82, 87, 116)',
                      }}>
                      Note: Your target language is set to {filters['target_language']}.
                    </Text>
                  </Stack>
                </Stack>

                <Stack space={3} style={styles.directionalTextContainer}>
                  <Text style={styles.directionalTextTitle}>
                    Enjoy conversation with peer 🧠
                  </Text>
                  <Text style={styles.directionalText}>
                    Enagage in simple discussion or complex topics about the
                    universe 🌎
                  </Text>
                </Stack>
              </Stack>
            </View>
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
        <SafeAreaView />
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  sessionStarted: {
    flex: 1,
    backgroundColor: 'rgb(243, 244 250)',
  },
  sessionAwaiting: {
    flex: 1,
    backgroundColor: 'rgb(243, 244 250)',
  },
  sessionAwaitingContainer: {
    width: '100%',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionalTextContainer: {
    borderRadius: 5,
    width: '100%',
    backgroundColor: '#FFF',
    padding: 15,
  },
  directionalText: {
    textAlign: 'center',
    color: 'rgb(82, 87, 116)',
  },
  directionalTextTitle: {
    textAlign: 'center',
    color: '#000000',
    fontWeight: '600',
  },
  directionalContainer: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'transparent',
    padding: 20,
  },
});

export default Main;
