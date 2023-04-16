import {KeyboardAvoidingView, StyleSheet} from 'react-native';
import {Box, Stack, HStack, Input} from 'native-base';
import {Surface, IconButton, TouchableRipple} from 'react-native-paper';
import Voice from '@react-native-community/voice';
import {useState, useEffect} from 'react';
import { BlurView } from "@react-native-community/blur";

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

  const speechStartHandler = e => {
  };

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
    } catch (error) {
    }
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
    } catch (error) {
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={60}
      style={{width: '100%'}}>
      <Box
        style={{
          padding: 10,
          marginBottom: 20,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }}>
        <HStack space={0} alignItems="center" style={styles.inputContainer}>
        <BlurView style={styles.blur} blurType='light' tint='#fff' intensity={10} />
          <Surface
            elevation={0}
            style={{
              width: '100%',
              borderWidth: 1,
              borderColor: '#ddd',
margin: 10,
              padding: 3,
              flex: 1,
              borderRadius: 20,
            }}>
            <Input
              value={inputVal}
              w="100%"
              onChangeText={onChange}
              style={{width: '100%'}}
              variant="unstyled"
              placeholder="Start a conversation"
            />
          </Surface>

          {inputVal.length > 0 && !speaking ? (
            <IconButton
              icon="send"
              iconColor="#FFFFFF"
              size={17}
              style={{paddingLeft: 3, marginRight: 15, backgroundColor: '#1E88E5'}}
              onPress={onSubmit}
            />
          ) : (
            <>
    
                <IconButton
                  onPress={
                    speaking ? () => stopRecording() : () => startRecording()
                  }
                  style={{marginLeft: 0, marginRight: 15}}
                  iconColor={speaking ? '#2196F3' : 'black'}
                  icon="microphone"
                  size={20}
                />
        
            </>
          )}
        </HStack>
      </Box>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  surface: {
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  message: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  blur: {
    padding: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default InputController