import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Helmet } from "react-helmet";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp(props) {
  const classes = useStyles();
  const [user, setUser] = useState(
    props.user || {
      name: "",
      surname: "",
      email: "",
      username: "",
      role: "",
      password: "",
    }
  );

  const [disabledSubmit, setDisabledSubmit] = useState(true);
  const handleAlert = () => {
    switch (props.alert) {
      case "email-exists":
        return <Alert severity="error">Email ya existe</Alert>;
      default:
        return null;
    }
  };

  const handleEditUser = (event) => {
    const auxUser = { ...user, [event.target.name]: event.target.value };
    setUser(auxUser);
    checkDisabledSubmit(auxUser);
  };

  const checkDisabledSubmit = (auxUser) => {
    let disabled = false;
    Object.keys(auxUser).forEach((property) => {
      if (auxUser[property] === "") {
        disabled = true;
      }
    });
    setDisabledSubmit(disabled);
  };
  return (
    <Container component="main" maxWidth="xs">
      <Helmet>
        <title>KAGGLE | SIGN UP</title>
      </Helmet>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} action="/signup" method="post">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {handleAlert()}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="name"
                variant="outlined"
                required
                fullWidth
                value={user.name}
                onChange={handleEditUser}
                id="name"
                label="Nombre"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="surname"
                value={user.surname}
                onChange={handleEditUser}
                label="Apellidos"
                name="surname"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                value={user.username}
                onChange={handleEditUser}
                label="Nombre de usuario"
                name="username"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Rol
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  name="role"
                  value={user.role}
                  required
                  fullWidth
                  onChange={handleEditUser}
                  label="Rol"
                >
                  <MenuItem value="player">Player</MenuItem>
                  <MenuItem value="challenger">Challenger</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                value={user.email}
                onChange={handleEditUser}
                label="Email"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                value={user.password}
                onChange={handleEditUser}
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={disabledSubmit}
            className={classes.submit}
          >
            Crear usuario
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                ¿Ya tienes usuario? Ve a login
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
