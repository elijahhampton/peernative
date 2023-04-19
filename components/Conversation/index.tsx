import {memo, useEffect, useRef} from 'react';
import {ScrollView, Text, StyleSheet, View} from 'react-native';
import {Box, Stack, HStack} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import React from 'react';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ChatInfoPanel from '../ChatInfoPanel';
import LoadingDots from '../LoadingDots';

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

type PeerResponse = IResponse & {suggestion: string; error?: string; loading: boolean; };
type UserResponse = IResponse;

function Conversation(props: IConversationProps) {
  const {conversation, sessionStarted, filters} = props;

  const scrollViewRef = useRef();

  const navigation = useNavigation()

  return (
    <Box style={{flex: 1}}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          backgroundColor: '#FFF',
          paddingBottom: 40,
          paddingLeft: 10,
          paddingRight: 10
        }}
        onContentSizeChange={() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({animated: true})
          }
        }

        }>
        <Stack space={5} style={{width: '100%' }}>
          {sessionStarted && conversation.map((response: IResponse) => {
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
    <Box
    key={response?.response}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
      }}>
      <Box
        style={{
          padding: 10,
          maxWidth: 250,
          borderRadius: 12,
          backgroundColor: '#B3E5FC',
          justifyContent: 'flex-end'
        }}>
        <Text style={{ fontSize: 15, fontWeight: '400' }}>
          {response?.content}
        </Text>
        <Text style={{ fontSize: 12, paddingTop: 4, fontWeight: 400, color: '#aaa'}}>
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
        <Box
            key={response?.response}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <Box
            style={{
              padding: 10,
              //  backgroundColor: '#B3E5FC',
              maxWidth: 250,
              borderRadius: 10,
            }}>
          <LoadingDots />
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      <Box
          key={response?.response}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}>
        <Box
          style={{
            padding: 10,
            borderRadius: 12,
            backgroundColor: '#eee',
            maxWidth: 250,
            borderRadius: 10,
          }}>
          <Text style={{ fontSize: 15, fontWeight: '400' }}>
            {response?.response}
          </Text>
          <Text style={{ fontSize: 12, paddingTop: 4, fontWeight: 400, color: '#aaa'}}>
          {moment(response?.timestamp).format('MM/DD/YYYY hh:mm A').toString()}
        </Text>
        </Box>
      </Box>

      <Box
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <Box
          style={{
            padding: 10,
            backgroundColor: '#B3E5FC',
            maxWidth: 250,
            borderRadius: 10,
          }}>
          <Text style={{ fontSize: 15, fontWeight: '400' }}>
            {response?.response}
          </Text>
          <Text style={{ fontSize: 12, paddingTop: 4, fontWeight: 400, color: '#aaa'}}>
          {moment(response?.timestamp).format('MM/DD/YYYY hh:mm A').toString()}
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
        <Box
            key={response?.response}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start'
          }}>
          <Box
            style={{

              //  backgroundColor: '#B3E5FC',
              maxWidth: 250,
              borderRadius: 10,
            }}>
           <LoadingDots />
          </Box>
        </Box>
      </>
    );
  }
  return (
    <>
      <Box
          key={response?.response}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start'
        }}>
        <Box
          style={{
            padding: 10,
              backgroundColor: '#eee',
            maxWidth: 250,
            borderRadius: 12,
          }}>
          <Text style={{ fontSize: 15, fontWeight: '400' }}>
            {response?.response}
          </Text>
          <Text style={{ fontSize: 12, paddingTop: 4, fontWeight: 400, color: '#aaa'}}>
          {moment(response?.timestamp).format('MM/DD/YYYY hh:mm A').toString()}
        </Text>
        </Box>
      </Box>

      {response?.suggestion && (
        <Box
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start'
          }}>
          <Box>
            <Box
              style={{
                padding: 10,
                backgroundColor: 'inherit',
                borderWidth: 1,
                borderColor: '#eee',
                maxWidth: 250,
                borderRadius: 10,
              }}>
              <HStack alignItems="center">
                <Icon name="information-circle-outline" size={22} />
                <Text
                  style={{
                    fontWeight: '600',
                    paddingTop: 5,
                    paddingBottom: 5,
                    fontSize: 16,
                  }}>
                  Suggestion
                </Text>
              </HStack>

              <Text style={{fontSize: 16, fontWeight: '400'}}>
                {response?.suggestion}
              </Text>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sessionStarted: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  sessionAwaiting: {
    flex: 1,
    backgroundColor: '#FFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Conversation;
export {type IResponse};
