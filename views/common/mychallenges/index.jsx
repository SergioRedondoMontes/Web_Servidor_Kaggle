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
import { Drawer } from "../../../viewsComponents/Drawer";
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
import { DatePicker } from "../../../viewsComponents/DatePicker";

import moment from "moment";

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
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const MyChallenges = (props) => {
  const classes = useStyles();

  const [openDialogAddChallenge, setOpenDialogAddChallenge] = useState(
    props.dialogOpen || false
  );
  const [challenge, setChallenge] = useState(
    props.challenge || {
      title: "",
      description: "",
      dateStart: null,
      dateEnd: null,
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

  const handleEditDateChallenge = (date, field) => {
    const auxChallenge = {
      ...challenge,
      [field]: date,
    };
    setChallenge(auxChallenge);
    checkDisabledSubmit(auxChallenge);
    console.log(date);
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
                href={`/challenges/${tableMeta.rowData[0]}/edit`}
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
            Añadir competición
          </Typography>
        </DialogTitle>
        <DialogContent>
          <form
            action={`/challenges`}
            method="post"
            enctype="multipart/form-data"
          >
            <Grid container spacing={2}>
              <input
                type="hidden"
                name="dateStart"
                value={
                  challenge.dateStart ? challenge.dateStart.toString() : ""
                }
              />
              <input
                type="hidden"
                name="dateEnd"
                value={challenge.dateEnd ? challenge.dateEnd.toString() : ""}
              />
              <Grid item xs={12}>
                {handleAlert()}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  placeholder="Titulo de la competición"
                  label="Nombre"
                  name="title"
                  value={challenge.title}
                  onChange={handleEditChallenge}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  placeholder="Descripción de la competición"
                  label="Descripción"
                  name="description"
                  multiline
                  rows={10}
                  value={challenge.description}
                  onChange={handleEditChallenge}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  date={challenge.dateStart}
                  variant="dialog"
                  format="DD/MM/YYYY"
                  onChangeDate={(date) =>
                    handleEditDateChallenge(date, "dateStart")
                  }
                  required={props.required}
                  label="Fecha inicio"
                  style={{ width: "100%" }}
                  okLabel="Aceptar"
                  cancelLabel="Cancelar"
                  invalidDateMessage="Fecha incorrecta"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  date={challenge.dateEnd}
                  variant="dialog"
                  format="DD/MM/YYYY"
                  label="Fecha fin"
                  onChangeDate={(date) =>
                    handleEditDateChallenge(date, "dateEnd")
                  }
                  required={props.required}
                  style={{ width: "100%" }}
                  okLabel="Aceptar"
                  cancelLabel="Cancelar"
                  invalidDateMessage="Fecha incorrecta"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Fichero base de la competición
                </Typography>
                <input type="file" name="base" />
                <Typography variant="body1">
                  Fichero ejemplo de la competición
                </Typography>
                <input type="file" name="example" />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  disabled={disabledSubmit}
                  color="primary"
                  fullWidth
                  type="submit"
                >
                  Añadir competición
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <Helmet>
        <title>KAGGLE | MY CHALLENGES</title>
      </Helmet>
      <Grid item xs={12}>
        <div style={{ display: "flex" }}>
          <AppBar loggedIn={props.loggedIn} user={props.appUser} />
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
        </div>
      </Grid>
    </Grid>
  );
};

export default MyChallenges;
