import { AxiosResponse } from 'axios';

import RankingListResponse from '../interfaces/RankingListResponse';
import ApiService from './ApiService';

const getRanking = async (
  page: number,
  limit: number
): Promise<RankingListResponse> =>
  new Promise(
    (
      resolve: (
        // eslint-disable-next-line no-unused-vars
        value: RankingListResponse | PromiseLike<RankingListResponse>
      ) => void,
      // eslint-disable-next-line no-unused-vars
      reject: (reason: Error) => void
    ): void => {
      ApiService.get(`${process.env.REACT_APP_RANKING_API_URL}/ranking`, {
        params: {
          page,
          limit,
        },
      }).then((result: AxiosResponse<RankingListResponse>) => {
        resolve(result.data);
      }, reject);
    }
  );

const RankingService = {
  getRanking,
};

export default RankingService;
