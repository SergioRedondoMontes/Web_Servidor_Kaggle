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
import { Drawer } from "../../../viewsComponents/Drawer";
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
    marginLeft: "240px",
    padding: theme.spacing(3),
  },
}));

const UsersStaff = (props) => {
  const classes = useStyles();

  const [openDialogAddUser, setOpenDialogAddUser] = useState(
    props.dialogOpen || false
  );
  const [user, setUser] = useState(
    props.user || { name: "", surname: "", email: "", username: "", role: "" }
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
    const auxUser = {
      ...user,
      [event.target.name]: event.target.value,
    };
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

  const handleDialogAddUser = () => {
    setOpenDialogAddUser(!openDialogAddUser);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <Dialog
        open={openDialogAddUser}
        onClose={handleDialogAddUser}
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
              props.appUser
                ? props.appUser.role === "admin"
                  ? "/admin/users"
                  : props.appUser.role === "employee"
                  ? "/staff/users"
                  : "/staff/users"
                : "/staff/users"
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
                  value={user.name}
                  onChange={handleEditUser}
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
                  value={user.surname}
                  onChange={handleEditUser}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  placeholder="Introduce nombre de usuario"
                  label="Nombre usuario"
                  value={user.username}
                  onChange={handleEditUser}
                  name="username"
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
                  margin="normal"
                  placeholder="email@email.com"
                  value={user.email}
                  onChange={handleEditUser}
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
      <Helmet>
        <title>KAGGLE STAFF | USERS</title>
      </Helmet>
      <Grid item xs={12}>
        <div style={{ display: "flex" }}>
          <AppBar loggedIn={props.loggedIn} user={props.appUser} />
          <Drawer user={props.appUser} />
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
                    onClick={handleDialogAddUser}
                  >
                    <PersonAddIcon />
                  </Button>
                </div>
              </Grid>
              <Grid item xs={12}>
                <DataTables data={props.users} columns={createColumns()} />
              </Grid>
            </Grid>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default UsersStaff;
