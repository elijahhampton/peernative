import React, {memo, useEffect, useRef} from 'react';
import {ScrollView, Text, StyleSheet, View} from 'react-native';
import {Box, Stack, HStack} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import LoadingDots from '../animations/LoadingDots';

Icon.loadFont();

interface IFilterState {
  desired_training_level: string;
  language: string;
  topic: string;
  target_language: string;
}

interface IConversationProps {
  conversation: Array<any>;
  sessionStarted: boolean;
  filters: IFilterState;
}

interface IResponse {
  response: string;
  role: string;
}

type PeerResponse = IResponse & {
  suggestion: string;
  error?: string;
  loading: boolean;
};
type UserResponse = IResponse;

function Conversation(props: IConversationProps) {
  const {conversation, sessionStarted, filters} = props;

  const scrollViewRef = useRef();

  const navigation = useNavigation();

  return (
    <Box style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.contentContainer}
        onContentSizeChange={() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({animated: true});
          }
        }}>
        <Stack space={5} style={styles.stack}>
          {sessionStarted &&
            conversation.map((response: IResponse) => {
              return renderResponse(response);
            })}
        </Stack>
      </ScrollView>
    </Box>
  );
}

const renderResponse = (response: IResponse): JSX.Element => {
  switch (response.role) {
    case 'user':
      return renderUserResponse(response);
    case 'system':
      return renderSystemResponse(response);
    case 'assistant':
      return renderPeerResponse(response);
    default:
      return null;
  }
};

const renderUserResponse = (response: UserResponse): JSX.Element => {
  return (
    <Box key={response?.response} style={styles.userResponseBox}>
      <Box style={styles.userResponseInnerBox}>
        <Text style={styles.text}>{response?.content}</Text>
        <Text style={styles.timestamp}>
          {moment(new Date()).format('MM/DD/YYYY hh:mm A').toString()}
        </Text>
      </Box>
    </Box>
  );
};

const renderPeerResponse = (response: PeerResponse): JSX.Element => {
  if (!!response?.isLoading) {
    return (
      <>
        <Box key={response?.response} style={styles.peerResponseLoadingBox}>
          <Box style={styles.peerResponseInnerBox}>
            <LoadingDots />
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      <Box key={response?.response} style={styles.peerResponseBox}>
        <Box style={styles.peerResponseInnerBox}>
          <Text style={styles.text}>{response?.response}</Text>
          <Text style={styles.timestamp}>
            {moment(response?.timestamp)
              .format('MM/DD/YYYY hh:mm A')
              .toString()}
          </Text>
        </Box>
      </Box>
    </>
  );
};

const renderSystemResponse = (response: IResponse): JSX.Element => {
  if (!!response?.isLoading) {
    return (
      <>
        <Box key={response?.response} style={styles.systemResponseLoadingBox}>
          <Box style={styles.systemResponseInnerBox}>
            <LoadingDots />
          </Box>
        </Box>
      </>
    );
  }
  return (
    <>
      <Box key={response?.response} style={styles.systemResponseBox}>
        <Box style={styles.systemResponseInnerBox}>
          <Text style={styles.text}>{response?.response}</Text>
          <Text style={styles.timestamp}>
            {moment(response?.timestamp)
              .format('MM/DD/YYYY hh:mm A')
              .toString()}
          </Text>
        </Box>
      </Box>

      {response?.suggestion && (
        <Box style={styles.suggestionBox}>
          <Box style={styles.suggestionInnerBox}>
            <HStack alignItems="center">
              <Icon name="information-circle-outline" size={22} />
              <Text style={styles.suggestionTitle}>Suggestion</Text>
            </HStack>

            <Text style={styles.suggestionText}>{response?.suggestion}</Text>
          </Box>
        </Box>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: '#FFF',
    paddingBottom: 40,
    paddingLeft: 10,
    paddingRight: 10,
  },
  stack: {
    width: '100%',
  },
  userResponseBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  userResponseInnerBox: {
    padding: 10,
    maxWidth: 250,
    borderRadius: 12,
    backgroundColor: '#B3E5FC',
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: 15,
    fontWeight: '400',
  },
  timestamp: {
    fontSize: 12,
    paddingTop: 4,
    fontWeight: '400',
    color: '#aaa',
  },
  peerResponseLoadingBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  peerResponseInnerBox: {
    padding: 10,
    maxWidth: 250,
    borderRadius: 10,
  },
  peerResponseBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  systemResponseLoadingBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  systemResponseInnerBox: {
    maxWidth: 250,
    borderRadius: 10,
  },
  systemResponseBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  suggestionBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  suggestionInnerBox: {
    padding: 10,
    backgroundColor: 'inherit',
    borderWidth: 1,
    borderColor: '#eee',
    maxWidth: 250,
    borderRadius: 10,
  },
  suggestionTitle: {
    fontWeight: '600',
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 16,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '400',
  },
});

export default Conversation;
export {type IResponse};
