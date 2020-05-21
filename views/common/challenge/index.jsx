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
import { AppBar } from "../../../viewsComponents/AppBar";
import { Card } from "../../../viewsComponents/Card";
import { DataTables } from "../../../viewsComponents/DataTables";

import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import FileSaver from "file-saver";

import moment from "moment";
moment.locale("es");

import { Helmet } from "react-helmet";
import { Chip, Divider, Tabs, Tab } from "@material-ui/core";

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
  content: {
    marginTop: "100px",
  },
}));

const Challenge = (props) => {
  const classes = useStyles();
  const [valueTab, setValueTab] = useState(
    props.alert
      ? props.alert === "participant_added"
        ? "participate"
        : "participants"
      : "participants"
  );

  const challenge = {
    ...props.challenge,
    dateStart: moment(props.challenge.dateStart),
    dateEnd: moment(props.challenge.dateEnd),
    status: moment().isBefore(moment(props.challenge.dateStart))
      ? "comming_soon"
      : moment().isBetween(
          moment(props.challenge.dateStart),
          moment(props.challenge.dateEnd)
        )
      ? "in_progress"
      : moment().isAfter(moment(props.challenge.dateEnd))
      ? "finished"
      : "finished",
  };

  const createLabelChip = () => {
    switch (challenge.status) {
      case "comming_soon":
        return "Próximamente";

      case "in_progress":
        return "En proceso";

      case "finished":
        return "Finalizado";

      default:
        return "";
    }
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
    ];
  };

  const urlToPromise = (url) => {
    return new Promise(function (resolve, reject) {
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
  const donwloadZip = () => {
    const zip = new JSZip();

    // EXAMPLE
    const filenameExample = `dev.${
      challenge.url_files.example.split(".")[
        challenge.url_files.example.split(".").length - 1
      ]
    }`;
    zip.file(filenameExample, urlToPromise(challenge.url_files.example), {
      binary: true,
    });
    // DEV
    const filenameDev = `oot0.${
      challenge.url_files.dev.split(".")[
        challenge.url_files.dev.split(".").length - 1
      ]
    }`;
    zip.file(filenameDev, urlToPromise(challenge.url_files.dev), {
      binary: true,
    });
    // PYTHON
    const filenameCompetition = `competition.${
      challenge.url_files.python.split(".")[
        challenge.url_files.python.split(".").length - 1
      ]
    }`;
    zip.file(filenameCompetition, urlToPromise(challenge.url_files.python), {
      binary: true,
    });

    zip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, "competition.zip");
    });
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
      case "participate":
        return (
          <Grid container justify="center">
            {props.loggedIn ? (
              !challenge.participant.find(
                (_participant) => _participant.userId == props.appUser._id
              ) ? (
                <Grid
                  item
                  xs={8}
                  style={{
                    display: "flex",
                    textAlign: "center",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="body1">¿Quieres participar?</Typography>
                  <form
                    action={`/challenges/${challenge._id}/participants`}
                    method="post"
                  >
                    <Button type="submit" variant="contained" color="primary">
                      APUNTATE YA
                    </Button>
                  </form>
                </Grid>
              ) : (
                <Grid item xs={8}>
                  <ul>
                    <li>
                      <Typography variant="body1">
                        Descarga el zip que contendrá los ficheros que necesitas
                      </Typography>
                      <Button variant="text" onClick={donwloadZip}>
                        Aquí
                      </Button>
                    </li>
                  </ul>
                </Grid>
              )
            ) : (
              <Grid
                item
                xs={8}
                style={{
                  display: "flex",
                  textAlign: "center",
                  flexDirection: "column",
                }}
              >
                <Typography variant="body1">¿Quieres participar?</Typography>
                <Typography variant="body1">
                  Necesitas estar registrado en nuestro portal para participar
                </Typography>

                <Button href="/login" variant="contained" color="primary">
                  INICIAR SESION
                </Button>
                <Typography variant="body1">O</Typography>
                <Button href="/signup" variant="contained" color="primary">
                  CREAR USUARIO
                </Button>
              </Grid>
            )}
          </Grid>
        );
      default:
        return null;
    }
  };

  console.log("challenge", challenge);

  const handleAlert = () => {
    switch (props.alert) {
      case "participant-added":
        return (
          <Alert severity="success">
            Has sido añadido a la competición, abjo tienes los pasos para
            participar
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <Helmet>
        <title>KAGGLE</title>
      </Helmet>
      <AppBar loggedIn={props.loggedIn} user={props.appUser} />
      <Grid
        item
        xs={12}
        style={{
          height: "50vh",
          background: "url('https://source.unsplash.com/random')",
          backgroundSize: "100vw",
        }}
      ></Grid>
      <Grid item xs={1} />
      <Grid item xs={10}>
        {handleAlert()}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h4" style={{ flex: "1" }}>
            {challenge.title}
          </Typography>
          <Chip label={createLabelChip()} />
        </div>
        <Divider style={{ margin: "12px 0" }} />
        <Typography variant="body1">{challenge.description}</Typography>
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
          {challenge.status === "in_progress" && (
            <Tab
              label={
                props.loggedIn
                  ? challenge.participant
                    ? challenge.participant.find(
                        (_participant) =>
                          _participant.userId == props.appUser._id
                      )
                      ? "Instrucciones"
                      : "Participar"
                    : "Participar"
                  : "Participar"
              }
              value="participate"
            />
          )}
        </Tabs>
        {renderContentTab()}
      </Grid>
    </Grid>
  );
};

export default Challenge;
