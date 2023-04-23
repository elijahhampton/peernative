import React, {memo, useEffect, useRef} from 'react';
import {ScrollView, Text, StyleSheet, View} from 'react-native';
import {Box, Stack, HStack} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import LoadingDots from '../animations/LoadingDots';
import UserResponse from '../Response/UserResponse';
import SystemResponse from '../Response/SystemResponse';

Icon.loadFont();

interface IConversationProps {
  conversation: Array<any>;
  sessionStarted: boolean;
}

interface IResponse {
  response: string;
  role: string;
}

type UserResponse = IResponse;

function Conversation(props: IConversationProps) {
  const {conversation, sessionStarted} = props;

  const scrollViewRef = useRef();

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
            conversation.map((response: IResponse, idx: number) => {
              return response?.role === 'user' ? (
                <UserResponse key={idx} response={response} />
              ) : (
                <SystemResponse key={idx} response={response} />
              );
            })}
        </Stack>
      </ScrollView>
    </Box>
  );
}

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
