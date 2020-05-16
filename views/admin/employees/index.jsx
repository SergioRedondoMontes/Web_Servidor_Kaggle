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
import { Chip, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
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
  content: {
    marginTop: "100px",
  },
}));

const EmployeesAdmin = (props) => {
  const classes = useStyles();
  const [openDialogAddEmployee, setOpenDialogAddEmployee] = useState(false);
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

  const handleDialogAddEmployee = () => {
    setOpenDialogAddEmployee(!openDialogAddEmployee);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <Dialog
        open={openDialogAddEmployee}
        onClose={handleDialogAddEmployee}
        fullWidth
        maxWidth="md"
        title="Añadir empleado"
      >
        <DialogTitle>
          <Typography variant="h6" align="center">
            Añadir empleado
          </Typography>
        </DialogTitle>
        <DialogContent>
          <form action="/employees/add" method="post">
            <input type="hidden" name="role" value="employee" />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  placeholder="Introduce nombre"
                  label="Nombre"
                  name="name"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  placeholder="Introduce apellidos"
                  label="Apellidos"
                  name="surname"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  placeholder="Introduce nombre de usuario"
                  label="Nombre usuario"
                  name="username"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  placeholder="xx@xx.com"
                  label="Email"
                  name="email"
                  fullWidth
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <Helmet>
        <title>KAGGLE STAFF | EMPLOYEES</title>
      </Helmet>
      <div style={{ display: "flex" }}>
        <AppBar loggedIn={props.loggedIn} user={props.user} />
      </div>
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
                  size="sm"
                  onClick={handleDialogAddEmployee}
                >
                  <PersonAddIcon />
                </Button>
              </div>
            </Grid>
            <Grid item xs={12}>
              <DataTables data={props.employees} columns={createColumns()} />
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};

export default EmployeesAdmin;
