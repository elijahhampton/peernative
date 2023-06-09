import React, {memo, useEffect, useRef} from 'react';
import {ScrollView, Text, StyleSheet, View} from 'react-native';
import {Box, Stack, HStack} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import LoadingDots from '../animations/LoadingDots';

interface IResponse {
  response: string;
  role: string;
}

interface IUserResponseProps {
  response: IResponse;
}

function UserResponse(props: IUserResponseProps) {
  const {response} = props;
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
    marginTop: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  userResponseInnerBox: {
    padding: 10,
    maxWidth: 250,

    borderRadius: 12,
    backgroundColor: '#218aff',
    justifyContent: 'flex-end',
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '400',
  },
  timestamp: {
    fontSize: 12,
    paddingTop: 4,
    fontWeight: '400',
    color: '#f9f9f9',
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

export default UserResponse;
