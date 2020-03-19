import React, { useEffect }from 'react';
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
  console.log("jhkj",props)
  useEffect(() => {
    props.images ? props.images.map(file => {
        
        if (file.publicUrl){
          console.log(file.publicUrl.split('https://storage.googleapis.com/images-6efd1.appspot.com/').pop().split('?GoogleAccessId=')[0])
        }
  
    }): null
  });


  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div">{props.user.email}</ListSubheader>
        </GridListTile>
        {props.images ? props.images.map(tile => (
          <GridListTile key={tile.id}>
            <img src={tile.publicUrl} alt={tile.id} />
            <GridListTileBar
              title={tile.id}
            //   subtitle={<span>by: {tile.author}</span>}
              actionIcon={
                <IconButton aria-label={`info about ${tile.id}`} className={classes.icon}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        )): null}
      </GridList>
    </div>
  );
}
