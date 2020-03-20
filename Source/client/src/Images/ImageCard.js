import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

export default function MediaControlCard(props) {
  const classes = useStyles();
  const theme = useTheme();
console.log("hi",props.image)
  return (
    <Card className={classes.root} key={props.id}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            Live From Space
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Mac Miller
          </Typography>
        </CardContent>
        <div className={classes.controls}>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Downlaod
        </Button>
        <Button size="small" color="primary">
          View
        </Button>
        <Button size="small" color="primary">
          Edit
        </Button>
        <Button size="small" color="primary">
          Delete
        </Button>
          {/* <IconButton aria-label="previous">
            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
          </IconButton>
          <IconButton aria-label="play/pause">
            <PlayArrowIcon className={classes.playIcon} />
          </IconButton>
          <IconButton aria-label="next">
            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
          </IconButton> */}
        </div>
      </div>
      <div class="container">
        <CardMedia
          className={classes.cover}
          image={'https://storage.googleapis.com/images-6efd1.appspot.com/Screen%20Shot%202020-03-16%20at%205.19.22%20PM.png_1584641735914?GoogleAccessId=firebase-adminsdk-1fisj%40images-6efd1.iam.gserviceaccount.com&Expires=16447042800&Signature=iwhQA6Lc2Rs9DswgDTqAjcwilXeI3WKevUJLIR6rD3Rons9Fl%2BKmJ4SDobU5u1gJjJiANBZa1wwjQ9c%2BgnCrtKFD%2BcbWjXAY%2BgN69BGK5S4mTZI6FM0B68kXi%2FFKPw5zEdIJilco%2B2HP8nXF0ROPrSLJFY8M%2FumSUIp4jDg2IccDvGLqfBMBN6o82zfh4cEbLHJoZgtO8zfgJKJjd2ZBh%2F2yNUx3m6Xj2qLXQsIrvyXVEh9rxlNFfFAXJw%2Fnx43pPkvwRbPoos1MbmNhNpjMHvzsv%2F6LHsORWhRI7CWAIgFnlSk2eYu3UN%2Bpbbaek6QgUhwBd4JFS1yk3NlDvG1kkg%3D%3D'}
          title="Live from space album cover"
        />
         <button class="btn">Button</button> 
      </div>
    </Card>
  );
}
