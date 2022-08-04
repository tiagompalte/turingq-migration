import { AxiosError, AxiosResponse } from 'axios';

import FormValidationError from '../errors/FormValidationError';
import AnswerDefinition from '../interfaces/AnswerDefinition';
import ApiService from './ApiService';

const saveAnswer = async (
  questionId: string,
  body: string
): Promise<AnswerDefinition> =>
  new Promise(
    (
      resolve: (
        // eslint-disable-next-line no-unused-vars
        value: AnswerDefinition | PromiseLike<AnswerDefinition>
      ) => void,
      // eslint-disable-next-line no-unused-vars
      reject: (reason: Error) => void
    ): void => {
      ApiService.post(
        `${process.env.REACT_APP_QUESTIONS_API_URL}/questions/${questionId}/answers/`,
        { body }
      ).then(
        (result: AxiosResponse<AnswerDefinition>) => {
          resolve(result.data);
        },
        (result: AxiosError) => {
          if (result.response?.status === 422) {
            reject(new FormValidationError(result.response?.data?.errors));
          } else if (result.response?.status === 401) {
            reject(new Error('You are not authorized to process this request'));
          } else {
            reject(result);
          }
        }
      );
    }
  );

const AnswersService = {
  saveAnswer,
};

export default AnswersService;
