import {KeyboardAvoidingView} from 'react-native';
import {Box, Stack, HStack, Input} from 'native-base';
import {Surface, IconButton, TouchableRipple} from 'react-native-paper';
import Voice from '@react-native-community/voice';
import {useState, useEffect} from 'react';

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
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }}>
        <HStack space={2} alignItems="center" style={{}}>
          <Surface
            elevation={0}
            style={{
              width: '100%',
              borderWidth: 1,
              borderColor: '#ddd',
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
              style={{paddingLeft: 3, backgroundColor: '#1E88E5'}}
              onPress={onSubmit}
            />
          ) : (
            <>
              <TouchableRipple>
                <IconButton
                  onPress={
                    speaking ? () => stopRecording() : () => startRecording()
                  }
                  style={{marginLeft: 0, marginRight: 0}}
                  iconColor={speaking ? '#2196F3' : 'black'}
                  icon="microphone"
                  size={20}
                />
              </TouchableRipple>
            </>
          )}
        </HStack>
      </Box>
    </KeyboardAvoidingView>
  );
}

export default InputController