import {
  CircularProgress,
  Divider,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import React, { ChangeEvent, useEffect, useState } from 'react';

import Page from '../components/Page';
import RankingInfo from '../components/RankingInfo';
import PaginationMetadata from '../interfaces/PaginationMetadata';
import RankingDefinition from '../interfaces/RankingDefinition';
import RankingListResponse from '../interfaces/RankingListResponse';
import RankingService from '../services/RankingService';

const useStyles = makeStyles((theme: Theme) => ({
  spacer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  loader: {
    margin: theme.spacing(5, 'auto'),
  },
}));

const Ranking: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [items, setItems] = useState<RankingDefinition[]>([]);
  const [page, setPage] = useState(1);
  const [paginationMetadata, setPaginationMetadata] = useState<
    PaginationMetadata | undefined
  >();
  const [loadingError, setError] = useState<string>();

  const limit = process.env.REACT_APP_PAGINATION_LIMIT as unknown as number;

  const changePage = (event: ChangeEvent<unknown>, value: number): void => {
    setPage(value);
  };

  useEffect(() => {
    RankingService.getRanking(page, limit).then(
      (result: RankingListResponse) => {
        setPaginationMetadata(result.meta);
        setItems(result.data);
        setIsLoading(false);
      },
      (error: Error) => {
        setIsLoading(false);
        setError(error.message);
      }
    );
  }, [page]);

  const classes = useStyles();

  let content;
  if (isLoading) {
    content = <CircularProgress className={classes.loader} />;
  } else if (loadingError || items.length === 0) {
    const message = loadingError || 'No ranking';
    content = (
      <Typography variant="body1" color="error" component="p">
        {message}
      </Typography>
    );
  } else {
    content = items.map((item, index) => (
      <React.Fragment key={item.user_id}>
        <RankingInfo
          position={limit * (page - 1) + index + 1}
          name={item.user_name}
          points={item.points}
        />
        <Grid container item xs={12} direction="row">
          <Divider className={classes.spacer} />
        </Grid>
      </React.Fragment>
    ));
  }

  return (
    <Page title="Ranking">
      {content}
      <Grid container item xs={12} direction="row" justifyContent="center">
        <Pagination
          page={paginationMetadata?.current_page || 1}
          count={paginationMetadata?.last_page || 1}
          onChange={changePage}
        />
      </Grid>
    </Page>
  );
};

export default Ranking;
