import PaginationMetadata from './PaginationMetadata';
import RankingDefinition from './RankingDefinition';

interface RankingListResponse {
  meta: PaginationMetadata;
  data: RankingDefinition[];
}

export default RankingListResponse;
