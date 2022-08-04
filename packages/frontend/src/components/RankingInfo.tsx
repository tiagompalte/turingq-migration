import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import * as React from 'react';

interface RankingProps {
  position: number;
  name: string;
  points: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  questionRow: {
    flexWrap: 'nowrap',
  },
  statistic: {
    flexGrow: 0,
    flexShrink: 0,
    width: '95px',
    marginRight: theme.spacing(2),
    textAlign: 'center',
  },
  mainInfo: {
    flexGrow: 1,
    flexShrink: 1,
    textAlign: 'right',
  },
}));

const RankingInfo: React.FC<RankingProps> = ({
  position,
  name,
  points,
}: RankingProps) => {
  const classes = useStyles();

  return (
    <Grid
      container
      item
      xs={12}
      direction="row"
      className={classes.questionRow}
    >
      <Card variant="outlined" className={classes.statistic}>
        <CardContent>
          <Typography variant="body1" color="textSecondary" component="p">
            {position}
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            position
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined" className={classes.statistic}>
        <CardContent>
          <Typography variant="body1" color="textSecondary" component="p">
            {points}
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            points
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined" className={classes.mainInfo}>
        <CardContent>
          <Typography variant="body1" color="textSecondary" component="p">
            {name}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            name
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default RankingInfo;
