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
import { Chip } from "@material-ui/core";
import { AppBar } from "../../../viewsComponents/AppBar";

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

const UsersStaff = (props) => {
  const classes = useStyles();

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
        name: "name",
        label: "Nombre",
        options: {
          filter: true,
        },
      },
      {
        name: "email",
        label: "Email",
        options: {
          filter: true,
        },
      },
      {
        name: "role",
        label: "Rol",
        options: {
          filter: true,
          filterType: "checkbox",
          customBodyRender: (value, tableMeta, updateValue) => (
            <Chip label={value} />
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
            <Button
              variant="contained"
              color="primary"
              href={`users/${tableMeta.rowData[0]}`}
            >
              Ver
            </Button>
          ),
        },
      },
    ];
  };
  return (
    <Grid container component="main" className={classes.root} justify="center">
      <div style={{ display: "flex" }}>
        <AppBar loggedIn={props.loggedIn} user={props.user} />
      </div>
      <Helmet>
        <title>KAGGLE STAFF</title>
      </Helmet>

      <Grid item xs={10}>
        <DataTables data={props.users} columns={createColumns()} />
      </Grid>
    </Grid>
  );
};

export default UsersStaff;
