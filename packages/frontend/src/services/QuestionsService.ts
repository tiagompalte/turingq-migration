import { AxiosError, AxiosResponse } from 'axios';

import ApiService from './ApiService';
import FormValidationError from '../errors/FormValidationError';
import QuestionDefinition from '../interfaces/QuestionDefinition';
import QuestionListResponse from '../interfaces/QuestionListResponse';

const getQuestions = async (
  page: number,
  limit: number
): Promise<QuestionListResponse> =>
  new Promise(
    (
      resolve: (
        // eslint-disable-next-line no-unused-vars
        value: QuestionListResponse | PromiseLike<QuestionListResponse>
      ) => void,
      // eslint-disable-next-line no-unused-vars
      reject: (reason: Error) => void
    ): void => {
      ApiService.get(`${process.env.REACT_APP_QUESTIONS_API_URL}/questions`, {
        params: {
          page,
          limit,
        },
      }).then((result: AxiosResponse<QuestionListResponse>) => {
        resolve(result.data);
      }, reject);
    }
  );

const getQuestion = async (id: string): Promise<QuestionDefinition> =>
  new Promise(
    (
      resolve: (
        // eslint-disable-next-line no-unused-vars
        value: QuestionDefinition | PromiseLike<QuestionDefinition>
      ) => void,
      // eslint-disable-next-line no-unused-vars
      reject: (reason: Error) => void
    ): void => {
      ApiService.get(
        `${process.env.REACT_APP_QUESTIONS_API_URL}/questions/${id}`
      ).then((result: AxiosResponse<QuestionDefinition>) => {
        resolve(result.data);
      }, reject);
    }
  );

const saveQuestion = async (
  title: string,
  body: string
): Promise<QuestionDefinition> =>
  new Promise(
    (
      resolve: (
        // eslint-disable-next-line no-unused-vars
        value: QuestionDefinition | PromiseLike<QuestionDefinition>
      ) => void,
      // eslint-disable-next-line no-unused-vars
      reject: (reason: Error) => void
    ): void => {
      ApiService.post(`${process.env.REACT_APP_QUESTIONS_API_URL}/questions`, {
        title,
        body,
      }).then(
        (result: AxiosResponse<QuestionDefinition>) => {
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

const QuestionsService = {
  getQuestion,
  getQuestions,
  saveQuestion,
};

export default QuestionsService;
