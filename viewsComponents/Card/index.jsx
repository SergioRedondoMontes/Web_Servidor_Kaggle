import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { default as CardMui } from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  media: {
    height: 140,
  },
});

const Card = (props) => {
  const classes = useStyles();
  return (
    <CardMui className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={`https://loremflickr.com/320/240/paris?random=${props.index}`}
          title={props.challenge.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.challenge.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.challenge.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          color="primary"
          href={`/challenges/${props.challenge._id}`}
        >
          Visitar
        </Button>
      </CardActions>
    </CardMui>
  );
};

export { Card };
