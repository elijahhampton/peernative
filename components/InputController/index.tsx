import {KeyboardAvoidingView, StyleSheet} from 'react-native';
import {Box, Stack, HStack, Input} from 'native-base';
import {Surface, IconButton, TouchableRipple} from 'react-native-paper';
import Voice from '@react-native-community/voice';
import {useState, useEffect} from 'react';
import {BlurView} from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/Ionicons';
//TODO: Keep microphone icon visible instead of send icon if user is speaking

interface IInputControllerProps {
  inputVal: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  onClearInput: () => void;
  onSetInputVal: (text: string) => void;
}

function InputController(props: IInputControllerProps) {
  const {inputVal, onSetInputVal, onChange, onSubmit, onClearInput} = props;

  const [speaking, setSpeaking] = useState<boolean>(false);

  const speechStartHandler = e => {};

  const speechEndHandler = e => {
    setSpeaking(false);
  };

  const speechResultsHandler = e => {
    const text = e.value[0];
    onSetInputVal(text);
  };

  const startRecording = async () => {
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

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setSpeaking(false);
    } catch (error) {}
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={60}
      style={{width: '100%'}}>
      <Box
        style={{
          // padding: 10
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          
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
            style={{
              width: '100%',
         //     borderWidth: 1,
          //    borderColor: '#ddd',
              margin: 10,
              flex: 1,
              borderRadius: 20,
  
            }}>
            <Input
              value={inputVal}
              w="100%"
              onChangeText={onChange}
              style={{
                width: '100%',
                backgroundColor: 'rgb(240, 240, 240)',
                borderRadius: 20,
              }}
              variant="unstyled"
              placeholder="Start a conversation"
            />
          </Surface>

          {inputVal.length > 0 && !speaking ? (
            <IconButton
              icon="send"
              iconColor="#FFFFFF"
              size={17}
              style={{backgroundColor: '#1E88E5'}}
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
              style={{ backgroundColor: 'transparent' }}
            />
          )}
        </HStack>
      </Box>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
  },
  messageContainer: {
    flex: 1,
  },
  inputContainer: {
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
    borderRadius: 10,
    backgroundColor: '#FFF',
    elevation: 10,
    overflow: 'hidden',
  },
  message: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  blur: {
    //padding: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default InputController;
