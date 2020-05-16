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
import FaceIcon from "@material-ui/icons/Face";

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
  const [openDialogAddEmployee, setOpenDialogAddEmployee] = useState(
    props.dialogOpen || false
  );
  const [employee, setEmployee] = useState(
    props.employee || { name: "", surname: "", email: "", username: "" }
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

  const handleEditEmployee = (event) => {
    const auxEmployee = {
      ...employee,
      [event.target.name]: event.target.value,
    };
    setEmployee(auxEmployee);
    checkDisabledSubmit(auxEmployee);
  };

  const checkDisabledSubmit = (auxEmployee) => {
    let disabled = false;
    Object.keys(auxEmployee).forEach((property) => {
      if (auxEmployee[property] === "") {
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
        name: "name",
        label: "Nombre",
        options: {
          filter: true,
        },
      },
      {
        name: "surname",
        label: "Apellidos",
        options: {
          filter: true,
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
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                href={`users/${tableMeta.rowData[0]}`}
              >
                Ver
              </Button>
            </div>
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
            Añadir empleado
          </Typography>
        </DialogTitle>
        <DialogContent>
          <form action="employees" method="post">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {handleAlert()}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  placeholder="Introduce nombre"
                  label="Nombre"
                  name="name"
                  value={employee.name}
                  onChange={handleEditEmployee}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  placeholder="Introduce apellidos"
                  label="Apellidos"
                  name="surname"
                  value={employee.surname}
                  onChange={handleEditEmployee}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  placeholder="Introduce nombre de usuario"
                  label="Nombre usuario"
                  value={employee.username}
                  onChange={handleEditEmployee}
                  name="username"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  placeholder="email@email.com"
                  value={employee.email}
                  onChange={handleEditEmployee}
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
                  Crear empleado
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <Helmet>
        <title>KAGGLE STAFF | EMPLOYEES</title>
      </Helmet>
      <div style={{ display: "flex" }}>
        <AppBar loggedIn={props.loggedIn} user={props.appUser} />
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
                  size="small"
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
