/* eslint-disable camelcase */
import { AxiosError, AxiosResponse } from 'axios';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import ApiService from './ApiService';
import FormValidationError from '../errors/FormValidationError';
// eslint-disable-next-line max-len
import FormValidationErrorResponse from '../interfaces/FormValidationErrorResponse';
import SignUpResponse from '../interfaces/SignUpResponse';

const signUp = (
  name: string,
  email: string,
  password: string,
  password_confirmation: string
): Promise<SignUpResponse> =>
  new Promise(
    (
      // eslint-disable-next-line no-unused-vars
      resolve: (value: SignUpResponse | PromiseLike<SignUpResponse>) => void,
      // eslint-disable-next-line no-unused-vars
      reject: (reason: Error) => void
    ): void => {
      ApiService.post(`${process.env.REACT_APP_API_BASE_URL}/registration`, {
        name,
        email,
        password,
        password_confirmation,
      }).then(
        (result: AxiosResponse<SignUpResponse>) => {
          if (result.status === StatusCodes.CREATED) {
            resolve(result.data);
          } else {
            reject(new Error(getReasonPhrase(result.status)));
          }
        },
        (error: AxiosError<FormValidationErrorResponse>) => {
          if (
            error.response &&
            error.response.status === StatusCodes.UNPROCESSABLE_ENTITY
          ) {
            reject(new FormValidationError(error.response.data.errors));
          }
          reject(error);
        }
      );
    }
  );

const SignUpService = {
  signUp,
};

export default SignUpService;
