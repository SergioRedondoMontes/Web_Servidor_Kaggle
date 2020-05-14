import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";

import { Helmet } from "react-helmet";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Home = (props) => {
  const classes = useStyles();

  const [email, setEmail] = useState(props.email || "");

  const handleAlert = () => {
    switch (props.alert) {
      case "email":
        return <Alert severity="error">Email incorrecto</Alert>;
      case "password":
        return <Alert severity="error">Email o contraseña incorrectos</Alert>;
      default:
        return null;
    }
  };
  return (
    <Grid container component="main" className={classes.root}>
      <Helmet>
        <title>KAGGLE</title>
      </Helmet>
      <Grid item xs={12}>
        {props.loggedIn ? (
          <Typography variant="h1">Bienvenido usuario {props.role}</Typography>
        ) : (
          <Button variant="contained" href="/login">
            Dirigete a iniciar sesión
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default Home;