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
import PersonAddIcon from "@material-ui/icons/PersonAdd";

import { Helmet } from "react-helmet";
import { DataTables } from "../../../viewsComponents/DataTables";
import { Drawer } from "../../../viewsComponents/Drawer";
import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Zoom,
} from "@material-ui/core";
import { AppBar } from "../../../viewsComponents/AppBar";
import FaceIcon from "@material-ui/icons/Face";
import moment from "moment";
import CountUp from "react-countup";

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
    flexGrow: 1,
    marginLeft: "240px",
    padding: theme.spacing(3),
  },
  card: {
    boxShadow:
      "rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px;",
    borderRadius: "8px",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "300px",
  },
}));

const DashboardAdmin = (props) => {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <Helmet>
        <title>KAGGLE STAFF | DASHBOARD</title>
      </Helmet>
      <Grid item xs={12}>
        <div style={{ display: "flex" }}>
          <AppBar loggedIn={props.loggedIn} user={props.appUser} />
          <Drawer user={props.appUser} />

          <div className={classes.content}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4">
                  ¡Hola de nuevo, estas son las estadísticas de Kaggle!
                </Typography>
              </Grid>
              <Zoom in={true}>
                <Grid item xs={12} md={4}>
                  <div className={classes.card}>
                    <Typography variant="h2">
                      <CountUp
                        end={
                          props.challenges.filter((challenge) =>
                            moment().isBefore(moment(challenge.dateStart))
                          ).length
                        }
                        duration={3}
                      />
                    </Typography>
                    <Typography variant="body1">
                      Próximas competiciones
                    </Typography>
                  </div>
                </Grid>
              </Zoom>
              <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                <Grid item xs={12} md={4}>
                  <div className={classes.card}>
                    <Typography variant="h2">
                      <CountUp
                        end={
                          props.challenges.filter((challenge) =>
                            moment().isBetween(
                              moment(challenge.dateStart),
                              moment(challenge.dateEnd)
                            )
                          ).length
                        }
                        duration={3}
                      />
                    </Typography>
                    <Typography variant="body1">
                      Competiciones en curso
                    </Typography>
                  </div>
                </Grid>
              </Zoom>
              <Zoom in={true} style={{ transitionDelay: "400ms" }}>
                <Grid item xs={12} md={4}>
                  <div className={classes.card}>
                    <Typography variant="h2">
                      <CountUp
                        end={
                          props.challenges.filter((challenge) =>
                            moment().isAfter(moment(challenge.dateEnd))
                          ).length
                        }
                        duration={3}
                      />
                    </Typography>
                    <Typography variant="body1">
                      Competiciones finalizadas
                    </Typography>
                  </div>
                </Grid>
              </Zoom>
              <Zoom in={true} style={{ transitionDelay: "600ms" }}>
                <Grid item xs={12} md={4}>
                  <div className={classes.card}>
                    <Typography variant="h2">
                      <CountUp
                        end={
                          props.users.filter(
                            (user) =>
                              user.role === "player" ||
                              user.role === "challenger"
                          ).length
                        }
                        duration={3}
                      />
                    </Typography>
                    <Typography variant="body1">Usuarios activos</Typography>
                  </div>
                </Grid>
              </Zoom>
              <Zoom in={true} style={{ transitionDelay: "800ms" }}>
                <Grid item xs={12} md={4}>
                  <div className={classes.card}>
                    <Typography variant="h2">
                      <CountUp
                        end={
                          props.users.filter((user) => user.role === "employee")
                            .length
                        }
                        duration={3}
                      />
                    </Typography>
                    <Typography variant="body1">Empleados activos</Typography>
                  </div>
                </Grid>
              </Zoom>
              <Zoom in={true} style={{ transitionDelay: "1000ms" }}>
                <Grid item xs={12} md={4}>
                  <div className={classes.card}>
                    <Typography variant="h2">
                      <CountUp
                        end={
                          props.users.filter((user) => user.role === "admin")
                            .length
                        }
                        duration={3}
                      />
                    </Typography>
                    <Typography variant="body1">
                      Administradores activos
                    </Typography>
                  </div>
                </Grid>
              </Zoom>
            </Grid>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default DashboardAdmin;
