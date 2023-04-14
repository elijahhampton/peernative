import {UseMutationResult, useMutation} from '@tanstack/react-query';
import {sendGreetingWithTargets, sendResponse} from '../../api';
import {AxiosError} from 'axios';

interface IUseSendGreetingWithTargetsVariables {
  greeting: string;
  user_target_language: string;
  user_language: string;
  training_level: string;
  topic: string;
}

interface IUseSendResponse {
  response: string;
  pastConversation: Array<any>;
}

function useSendGreetingWithTargets(): UseMutationResult<
  any,
  AxiosError,
  IUseSendGreetingWithTargetsVariables
> {
  return useMutation(
    ['send_greeting_with_targets'],
    ({greeting, user_target_language, user_language, training_level, topic}) =>
      sendGreetingWithTargets(
        greeting,
        user_target_language,
        user_language,
        training_level,
        topic,
      ),
  );
}

function useSendResponse(): UseMutationResult<
  any,
  AxiosError,
  IUseSendResponse
> {
  return useMutation(['send_response'], ({response, pastConversation}) =>
    sendResponse(response, pastConversation),
  );
}

export {useSendGreetingWithTargets, useSendResponse};