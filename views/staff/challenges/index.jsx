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
import { DataTables } from "../../../viewsComponents/DataTables";
import {
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { AppBar } from "../../../viewsComponents/AppBar";

import PersonAddIcon from "@material-ui/icons/PersonAdd";
import FaceIcon from "@material-ui/icons/Face";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
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
  content: {
    marginTop: "100px",
  },
}));

const ChallengesStaff = (props) => {
  const classes = useStyles();

  const [openDialogAddChallenge, setOpenDialogAddChallenge] = useState(
    props.dialogOpen || false
  );
  const [challenge, setChallenge] = useState(
    props.challenge || {
      name: "",
      surname: "",
      email: "",
      challengename: "",
      role: "",
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

  const handleEditChallenge = (event) => {
    const auxChallenge = {
      ...challenge,
      [event.target.name]: event.target.value,
    };
    setChallenge(auxChallenge);
    checkDisabledSubmit(auxChallenge);
  };

  const checkDisabledSubmit = (auxChallenge) => {
    let disabled = false;
    Object.keys(auxChallenge).forEach((property) => {
      if (auxChallenge[property] === "") {
        disabled = true;
      }
    });
    setDisabledSubmit(disabled);
  };

  const createColumns = () => {
    return [
      {
        name: "_id",
        label: "id",
        options: {
          filter: false,
          display: false,
        },
      },
      {
        name: "title",
        label: "Titulo",
        options: {
          filter: true,
        },
      },
      {
        name: "participant",
        label: "Nº de participantes",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <Typography variant="body2">{value.length}</Typography>
          ),
        },
      },
      {
        name: "owner",
        label: "Creador",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <Button variant="outlined" href={`users/${value}`}>
              Ir
            </Button>
          ),
        },
      },
      {
        name: "options",
        label: "",
        options: {
          label: false,
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                href={`challenges/${tableMeta.rowData[0]}`}
              >
                Ver
              </Button>
            </div>
          ),
        },
      },
    ];
  };

  const handleDialogAddChallenge = () => {
    setOpenDialogAddChallenge(!openDialogAddChallenge);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <Dialog
        open={openDialogAddChallenge}
        onClose={handleDialogAddChallenge}
        fullWidth
        maxWidth="md"
        title="Añadir empleado"
      >
        <DialogTitle
          style={{
            display: "flex",
            alignItems: "center",
            flexFlow: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" align="center">
            <FaceIcon style={{ fontSize: "48px" }} />
          </Typography>
          <Typography variant="h6" align="center">
            Añadir usuario
          </Typography>
        </DialogTitle>
        <DialogContent>
          <form
            action={
              props.appChallenge
                ? props.appChallenge.role === "admin"
                  ? "/admin/challenges"
                  : props.appChallenge.role === "staff"
                  ? "/staff/challenges"
                  : "/staff/challenges"
                : "/staff/challenges"
            }
            method="post"
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {handleAlert()}
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  placeholder="Introduce nombre"
                  label="Nombre"
                  name="name"
                  value={challenge.name}
                  onChange={handleEditChallenge}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  placeholder="Introduce apellidos"
                  label="Apellidos"
                  name="surname"
                  value={challenge.surname}
                  onChange={handleEditChallenge}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  placeholder="Introduce nombre de usuario"
                  label="Nombre usuario"
                  value={challenge.challengename}
                  onChange={handleEditChallenge}
                  name="challengename"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  margin="normal"
                  fullWidth
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    Rol
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    name="role"
                    value={challenge.role}
                    required
                    fullWidth
                    onChange={handleEditChallenge}
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
                  margin="normal"
                  placeholder="email@email.com"
                  value={challenge.email}
                  onChange={handleEditChallenge}
                  label="Email"
                  name="email"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  disabled={disabledSubmit}
                  color="primary"
                  fullWidth
                  type="submit"
                >
                  Crear usuario
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

      <div style={{ display: "flex" }}>
        <AppBar loggedIn={props.loggedIn} user={props.appUser} />
      </div>
      <Helmet>
        <title>KAGGLE STAFF | USERS</title>
      </Helmet>

      <Grid item xs={1} />
      <Grid item xs={10}>
        <div className={classes.content}>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleDialogAddChallenge}
                >
                  <PersonAddIcon />
                </Button>
              </div>
            </Grid>
            <Grid item xs={12}>
              <DataTables data={props.challenges} columns={createColumns()} />
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};

export default ChallengesStaff;
