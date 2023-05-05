import React, { memo, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Box, Stack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import LoadingDots from '../animations/LoadingDots';
import UserResponse from '../Response/UserResponse';
import SystemResponse from '../Response/SystemResponse';

interface ConversationProps {
  conversation: { response: string; role: 'user' | 'system' }[];
  sessionStarted: boolean;
}

type UserResponse = { response: string; role: 'user' };

function Conversation({ conversation, sessionStarted }: ConversationProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [conversation]);

  return (
    <Box style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Stack space={5} style={styles.stack}>
          {sessionStarted &&
            conversation.map((response, idx) => {
              return response.role === 'user' ? (
                <UserResponse key={idx} response={response} />
              ) : (
                <SystemResponse key={idx} response={response} />
              );
            })}
          {!sessionStarted && (
            <Box style={styles.loadingDotsContainer}>
              <LoadingDots size={10} />
            </Box>
          )}
        </Stack>
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(243, 244, 250)',
  },
  contentContainer: {
    backgroundColor: 'rgb(243, 244, 250)',
    paddingBottom: 40,
    paddingLeft: 10,
    paddingRight: 10,
  },
  stack: {
    width: '100%',
  },
  loadingDotsContainer: {
    alignSelf: 'center',
    marginVertical: 10,
  },
});

export default memo(Conversation);
