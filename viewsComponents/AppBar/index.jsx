import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { default as AppBarMui } from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { Link, Button } from "@material-ui/core";

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: "inherit",
    textDecoration: "none",
  },
}));

const AppBar = (props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const createMenuItem = (role) => {
    switch (role) {
      case "player":
        return [
          <MenuItem>
            <Link href={`/profile`} className={classes.link}>
              Mi perfil
            </Link>
          </MenuItem>,
          <MenuItem>
            <Link href={`/signout`} className={classes.link}>
              Cerrar sesión
            </Link>
          </MenuItem>,
        ];

      case "challenger":
        return [
          <MenuItem>
            <Link href={`/profile`} className={classes.link}>
              Mi perfil
            </Link>
          </MenuItem>,
          <MenuItem>
            <Link href={`/signout`} className={classes.link}>
              Cerrar sesión
            </Link>
          </MenuItem>,
        ];

      case "employee":
        return [
          <MenuItem>
            <Link
              href={`/users/${props.user ? props.user._id : null}`}
              className={classes.link}
            >
              Mi perfil
            </Link>
          </MenuItem>,
          <MenuItem>
            <Link href={`/staff/signout`}>Cerrar sesión</Link>
          </MenuItem>,
        ];

      case "admin":
        return [
          <MenuItem>
            <Link
              className={classes.link}
              href={`/admin/users/${props.user ? props.user._id : null}`}
            >
              Mi perfil
            </Link>
          </MenuItem>,
          <MenuItem>
            <Link href={`/admin/signout`} className={classes.link}>
              Cerrar sesión
            </Link>
          </MenuItem>,
        ];

      default:
        break;
    }
  };

  const createTitleHref = (role) => {
    switch (role) {
      case "player":
      case "challenger":
        return "/";
      case "employee":
        return "/staff";
      case "admin":
        return "/admin";
      default:
        return "/";
    }
  };
  return (
    <AppBarMui position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <Link
            className={classes.link}
            href={createTitleHref(props.user ? props.user.role : null)}
          >
            KAGGLE
          </Link>
        </Typography>
        {props.loggedIn ? (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleMenu}
            >
              <Typography variant="caption">
                {props.user ? props.user.name || props.user.role : "user"}
              </Typography>
              <ArrowDropDownIcon />
            </div>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              {createMenuItem(props.user ? props.user.role || null : null)}
            </Menu>
          </div>
        ) : (
          <Button color="inherit" href="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBarMui>
  );
};

export { AppBar };
