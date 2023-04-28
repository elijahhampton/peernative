import axios from 'axios';
import {BASE_ENDPOINT, ROUTES} from '../constants/api';

const sendGreetingWithTargets = async (
  greeting: string,
  user_language: string,
  user_target_language: string,
  topic: string,
  training_level: string,
) => {
  const axiosResponse = await axios(`${BASE_ENDPOINT}/${ROUTES.greeting}`, {
    method: 'POST',
    data: JSON.stringify({
      greeting,
      user_language,
      user_target_language,
      topic,
      training_level,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  console.log(axiosResponse);
  return axiosResponse.data;
};

const sendResponse = async (
  userResponse: string,
  pastConversation: Array<any>,
) => {
  const axiosResponse = await axios(`${BASE_ENDPOINT}/${ROUTES.reply}`, {
    method: 'POST',
    data: JSON.stringify({
      userResponse,
      pastConversation,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  console.log(axiosResponse);

  return axiosResponse.data;
};

export {sendGreetingWithTargets, sendResponse};
