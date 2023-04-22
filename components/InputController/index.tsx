import {KeyboardAvoidingView, StyleSheet, Dimensions} from 'react-native';
import {Box, Stack, HStack, Input} from 'native-base';
import {Surface, IconButton, TouchableRipple} from 'react-native-paper';
import Voice from '@react-native-community/voice';
import {useState, useEffect} from 'react';
import {BlurView} from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/Ionicons';

interface IInputControllerProps {
  inputVal: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  onClearInput: () => void;
  onSetInputVal: (text: string) => void;
}

function InputController(props: IInputControllerProps): JSX.Element {
  const {inputVal, onSetInputVal, onChange, onSubmit, onClearInput} = props;

  const [speaking, setSpeaking] = useState<boolean>(false);

  const speechStartHandler = (e: any): void => {};

  const speechEndHandler = (e: any): void => {
    setSpeaking(false);
  };

  const speechResultsHandler = (e: any): void => {
    const text: string = e.value[0];
    onSetInputVal(text);
  };

  const startRecording = async (): Promise<void> => {
    setSpeaking(true);

    try {
      await Voice.start('en-Us');
    } catch (error) {}
  };

  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const stopRecording = async (): Promise<void> => {
    try {
      await Voice.stop();
      setSpeaking(false);
    } catch (error) {}
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={130}
      style={styles.container}>
      <Box
        style={{
          // padding: 10
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: Dimensions.get('screen').width
          
        }}>
        <HStack space={2} alignItems="center" style={styles.inputContainer}>
          <BlurView
            style={styles.blur}
            blurType="light"
            tint="#fff"
            intensity={10}
          />
          <Surface
            elevation={0}
            style={styles.surface}>
            <Input
              value={inputVal}
              w="100%"
              p={3}
              onChangeText={onChange}
              style={styles.input}
              variant="unstyled"
              placeholder="Start a conversation"
            />
          </Surface>

          {inputVal.length > 0 && !speaking ? (
            <IconButton
              icon="send"
              iconColor="#FFFFFF"
              size={17}
              style={styles.sendButton}
              onPress={onSubmit}
            />
          ) : (
            <Icon
              name="ios-mic"
              onPress={
                speaking ? () => stopRecording() : () => startRecording()
              }
              color={speaking ? '#2196F3' : 'black'}
              size={20}
              style={styles.micIcon}
            />
          )}
        </HStack>
      </Box>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width,
    backgroundColor: '#FFF',
    padding: 10,
  },
  messageContainer: {
    flex: 1,
  },
  inputContainer: {
    width: Dimensions.get('screen').width,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingLeft: 0,
    paddingRight: 20
  },
  surface: {
    width: '100%',
    //margin: 10,
    marginTop: 10 ,
    flex: 1,
    borderRadius: 20,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgb(240, 240, 240)',
    borderRadius: 20,
  },
  blur: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('screen').width
  },
  sendButton: {
    backgroundColor: '#1E88E5',
  },
  micIcon: {
    backgroundColor: 'transparent',
  },
});

export default InputController