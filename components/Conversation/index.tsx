//@ts-nocheck
import { memo } from 'react'
import {ScrollView, Text, StyleSheet} from 'react-native';
import {Box, Stack, HStack} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

Icon.loadFont();

interface IConversationProps {
  conversation: Array<any>;
}

interface IResponse {
  response: string;
  role: string;
}

type PeerResponse = IResponse & {suggestion: string; error?: string};
type UserResponse = IResponse;

function Conversation(props: IConversationProps) {
  const {conversation} = props;

  return (
    <Box style={{flex: 1}}>
      <ScrollView contentContainerStyle={{paddingLeft: 20, paddingRight: 20}}>
        <Stack space={5}>
          {conversation.map((response: IResponse) => {
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
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}>
      <Box
        style={{
          left: 0,
          padding: 10,
          //     backgroundColor: '#eee',
          maxWidth: 250,
          borderRadius: 10,
        }}>
        <Text style={{fontSize: 16, fontWeight: '500'}}>
          {response?.content}
        </Text>
      </Box>
    </Box>
  );
};

const renderPeerResponse = (response: PeerResponse): JSX.Element => {
  return (
    <>
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
            // backgroundColor: '#B3E5FC',
            maxWidth: 250,
            borderRadius: 10,
          }}>
          <Text style={{fontSize: 16, fontWeight: '500'}}>
            {response?.response}
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
          <Text style={{fontSize: 16, fontWeight: '500'}}>
            {response?.response}
          </Text>
        </Box>
      </Box>
    </>
  );
};

const renderSystemResponse = (response: IResponse): JSX.Element => {
  return (
    <>
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
            //  backgroundColor: '#B3E5FC',
            maxWidth: 250,
            borderRadius: 10,
          }}>
          <Text style={{fontSize: 16, fontWeight: '500'}}>
            {response?.response}
          </Text>
        </Box>
      </Box>

      {response?.suggestion && (
        <Box
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
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

export default Conversation;
export { type IResponse }