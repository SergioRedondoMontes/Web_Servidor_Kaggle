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
import moment from "moment";

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
  Divider,
  Tabs,
  Tab,
  Breadcrumbs,
} from "@material-ui/core";
import { AppBar } from "../../../viewsComponents/AppBar";

import EditIcon from "@material-ui/icons/Edit";

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

const ChallengeStaff = (props) => {
  const classes = useStyles();
  const [valueTab, setValueTab] = useState("participants");

  const [openDialogEditChallenge, setOpenDialogEditChallenge] = useState(
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

  const createColumnsParticipants = () => {
    return [
      {
        name: "userId",
        label: "Id usuario",
        options: {
          filter: false,
          display: false,
        },
      },
      {
        name: "username",
        label: "Username",
        options: {
          filter: true,
        },
      },
      {
        name: "date",
        label: "Fecha",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <Typography variant="body2">{moment(value).fromNow()}</Typography>
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
                href={`/staff/users/${tableMeta.rowData[0]}`}
              >
                Ver usuario
              </Button>
            </div>
          ),
        },
      },
    ];
  };

  const createColumnsRanking = () => {
    return [
      {
        name: "userId",
        label: "Id usuario",
        options: {
          filter: false,
          display: false,
        },
      },
      {
        name: "username",
        label: "Username",
        options: {
          filter: true,
        },
      },
      {
        name: "score",
        label: "Puntuación",
        options: {
          filter: true,
        },
      },
      {
        name: "date",
        label: "Fecha",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <Typography variant="body2">{moment(value).fromNow()}</Typography>
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
                href={`/users/${tableMeta.rowData[0]}`}
              >
                Ver usuario
              </Button>
            </div>
          ),
        },
      },
    ];
  };

  const handleDialogEditChallenge = () => {
    setOpenDialogEditChallenge(!openDialogEditChallenge);
  };

  const renderContentTab = () => {
    switch (valueTab) {
      case "ranking":
        return (
          <DataTables
            data={props.challenge.ranking}
            columns={createColumnsRanking()}
          />
        );
      case "participants":
        return (
          <DataTables
            data={props.challenge.participant}
            columns={createColumnsParticipants()}
          />
        );

      default:
        break;
    }
  };
  return (
    <Grid container component="main" className={classes.root}>
      <Dialog
        open={openDialogEditChallenge}
        onClose={handleDialogEditChallenge}
        fullWidth
        maxWidth="md"
        title="Editar competición"
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
            Editar competición
          </Typography>
        </DialogTitle>
        <DialogContent>
          <form
            action={
              props.appUser
                ? props.appUser.role === "admin"
                  ? `/admin/challenges/${props.challenge._id.toString()}`
                  : props.appUser.role === "employee"
                  ? `/staff/challenges/${props.challenge._id.toString()}`
                  : `/staff/challenges/${props.challenge._id.toString()}`
                : `/staff/challenges/${props.challenge._id.toString()}`
            }
            method="post"
          >
            <Grid container spacing={2}>
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
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  disabled={disabledSubmit}
                  color="primary"
                  fullWidth
                  type="submit"
                >
                  Editar competición
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
        <title>KAGGLE STAFF</title>
      </Helmet>

      <Grid item xs={1} />
      <Grid item xs={10}>
        <div className={classes.content}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" href="/staff/challenges">
                  Competiciones
                </Link>
                <Typography variant="body1">
                  {props.challenge._id.toString()}
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12}>
              <div style={{ display: "flex" }}>
                <Typography variant="h4" style={{ flex: "1" }}>
                  {props.challenge.title}
                </Typography>
                <Button
                  variant="contained"
                  style={{ background: "yellow" }}
                  onClick={handleDialogEditChallenge}
                >
                  <EditIcon />
                </Button>
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <Typography variant="body1">
                {props.challenge.description}
              </Typography>
              <Tabs
                style={{ margin: "12px 0" }}
                value={valueTab}
                variant="fullWidth"
                onChange={(e, value) => {
                  setValueTab(value);
                }}
                aria-label="simple tabs example"
              >
                <Tab label="Ranking" value="ranking" />
                <Tab label="Participantes" value="participants" />
              </Tabs>
              {renderContentTab()}
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};

export default ChallengeStaff;
