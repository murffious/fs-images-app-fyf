import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));


export default function TitlebarGridList(props) {
  const classes = useStyles();
console.log(props)
  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div">{props.user.email}</ListSubheader>
        </GridListTile>
        {props.images.map(tile => (
          <GridListTile key={tile.id}>
            <img src={'https://storage.googleapis.com/images-6efd1.appspot.com/Screen%20Shot%202020-03-16%20at%205.19.22%20PM.png_1584641735914?GoogleAccessId=firebase-adminsdk-1fisj%40images-6efd1.iam.gserviceaccount.com&Expires=16447042800&Signature=iwhQA6Lc2Rs9DswgDTqAjcwilXeI3WKevUJLIR6rD3Rons9Fl%2BKmJ4SDobU5u1gJjJiANBZa1wwjQ9c%2BgnCrtKFD%2BcbWjXAY%2BgN69BGK5S4mTZI6FM0B68kXi%2FFKPw5zEdIJilco%2B2HP8nXF0ROPrSLJFY8M%2FumSUIp4jDg2IccDvGLqfBMBN6o82zfh4cEbLHJoZgtO8zfgJKJjd2ZBh%2F2yNUx3m6Xj2qLXQsIrvyXVEh9rxlNFfFAXJw%2Fnx43pPkvwRbPoos1MbmNhNpjMHvzsv%2F6LHsORWhRI7CWAIgFnlSk2eYu3UN%2Bpbbaek6QgUhwBd4JFS1yk3NlDvG1kkg%3D%3D'} alt={tile.name} />
            <GridListTileBar
              title={tile.name}
            //   subtitle={<span>by: {tile.author}</span>}
              actionIcon={
                <IconButton aria-label={`info about ${tile.name}`} className={classes.icon}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
