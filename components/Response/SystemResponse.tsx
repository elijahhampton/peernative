import React, {memo, useEffect, useRef} from 'react';
import {ScrollView, Text, StyleSheet, View} from 'react-native';
import {Box, Stack, HStack} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import LoadingDots from '../animations/LoadingDots';
import LinearGradient from 'react-native-linear-gradient';

interface IResponse {
    response: string;
    role: string;
  }

  type PeerResponse = IResponse & {
    suggestion: string;
    error?: string;
    loading: boolean;
  };

interface ISystemResponseProps {
    response: PeerResponse;
}




function SystemResponse(props: ISystemResponseProps) {
    const { response } = props;

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
        <Box key={response?.response} style={styles.systemResponseBox}>

            <Text style={styles.text}>{response?.response}</Text>
            <Text style={styles.timestamp}>
              {moment(response?.timestamp)
                .format('MM/DD/YYYY hh:mm A')
                .toString()}
            </Text>
    
        </Box>
  
        {response?.suggestion && (

  <LinearGradient
        colors={['#1e90ff', '#87CEFA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bubble}
      >
        <Icon name='information-circle-outline' size={22} color='#FFFFFF'  />
        <Text style={styles.message}>{response?.suggestion}</Text>
      </LinearGradient>
  
            

 
        )}
      </>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    bubble: {
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        maxWidth: '70%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
      },
      message: {
        color: '#fff',
        fontSize: 14,
        paddingHorizontal: 10,
        fontFamily: 'System', // Change to a custom font if desired
      },
    contentContainer: {
      backgroundColor: '#FFF',
      paddingBottom: 40,
      paddingLeft: 10,
      paddingRight: 10,
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
      maxWidth: '70%',
      borderRadius: 10,
    },
    systemResponseLoadingBox: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    systemResponseInnerBox: {
      maxWidth: '70%',
      borderRadius: 10,
    },
    systemResponseBox: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        borderRadius: 8,
        maxWidth: '70%',
        marginTop: 10,
        marginBottom: 10,
      justifyContent: 'flex-start',
    },
  });

export default SystemResponse