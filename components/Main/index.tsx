import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from 'react-native';

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

  const clear = () => {
    setTextInputVal('');
  };

  const {
    isLoading: isLoadingPromptGreeting,
    mutateAsync: onPromptAsync,
  } = useSendGreetingWithTargets();
  const {
    isLoading: isLoadingGptResponse,
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

    onRespondAsync({
      response: myResponse,
      pastConversation: conversationCache,
    })
      .then((axiosResponse: any) => {
        console.log(axiosResponse)
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
    <SafeAreaView style={styles.container}>
      <Appbar
        title="Peer"
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
              filters={filters}
              conversation={conversation}
              sessionStarted={hasSessionStarted}
            />
          ) : (
            <View style={styles.sessionAwaitingContainer}>
              <Stack space={5} style={styles.directionalContainer}>
                <Stack space={3} style={styles.directionalTextContainer}>
                  <Button
                    mode="text"
                    onPress={() => navigation.navigate('Settings')}
                    style={{}}>
                    Configure your settings ⚙️
                  </Button>
                </Stack>

                <Stack space={3} style={styles.directionalTextContainer}>
                  <Text style={styles.directionalTextTitle}>
                    Send your first message 💬
                  </Text>
                  <Text style={styles.directionalText}>
                    Choose your language, target language, target level and
                    topic
                  </Text>
                  <Stack space={1}>
                    <Text
                      style={{
                        fontSize: 12,
                        textAlign: 'center',
                        color: 'rgb(82, 87, 116)',
                      }}>
                      Note: Your language is set to English.
                    </Text>

                    <Text
                      style={{
                        fontSize: 12,
                        textAlign: 'center',
                        color: 'rgb(82, 87, 116)',
                      }}>
                      Note: Your target language is set to Spanish.
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
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  sessionStarted: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  sessionAwaiting: {
    flex: 1,
    backgroundColor: '#FFF',
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
    color: '#212121',
    fontWeight: '600',
  },
  directionalContainer: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
});

export default Main;
