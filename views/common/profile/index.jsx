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
import { Drawer } from "../../../viewsComponents/Drawer";

import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import FaceIcon from "@material-ui/icons/Face";
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
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const Profile = (props) => {
  const classes = useStyles();
  const [openDialogEditUser, setOpenDialogEditUser] = useState(
    props.dialogOpen || false
  );
  const [user, setUser] = useState(
    props.user || {
      name: "",
      surname: "",
      email: "",
      username: "",
      role: "",
    }
  );
  const [disabledSubmit, setDisabledSubmit] = useState(true);

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

  const handleDialogEditUser = () => {
    setOpenDialogEditUser(!openDialogEditUser);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <Dialog
        open={openDialogEditUser}
        onClose={handleDialogEditUser}
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
            <FaceIcon style={{ fontSize: "48px" }} />
          </Typography>
          <Typography variant="h6" align="center">
            Editar usuario
          </Typography>
        </DialogTitle>
        <DialogContent>
          <form action={`/profile`} method="post">
            <Grid container spacing={2}>
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
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  disabled={disabledSubmit}
                  color="primary"
                  fullWidth
                  type="submit"
                >
                  Editar usuario
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <Helmet>
        <title>KAGGLE | PERFIL</title>
      </Helmet>
      <Grid item xs={12}>
        <div style={{ display: "flex" }}>
          <AppBar loggedIn={props.loggedIn} user={props.appUser} />

          <div className={classes.content}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h2">My perfil</Typography>
              </Grid>
              <Grid item xs={12}>
                <div style={{ display: "flex" }}>
                  <Typography variant="h4" style={{ flex: "1" }}>
                    {props.user.name + " " + props.user.surname}
                  </Typography>
                  <Button
                    variant="contained"
                    style={{ background: "yellow", marginRight: "16px" }}
                    onClick={handleDialogEditUser}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="contained"
                    style={{ background: "red" }}
                    href={`/profile/delete`}
                  >
                    <HighlightOffIcon />
                  </Button>
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <Typography variant="body1">
                  Nombre de usuario: {props.user.username}
                </Typography>
                <Typography variant="body1">
                  Email: {props.user.email}
                </Typography>
                <Typography variant="body1">
                  Rol: {<Chip label={props.user.role} />}
                </Typography>
              </Grid>
            </Grid>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default Profile;
