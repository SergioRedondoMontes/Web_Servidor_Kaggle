import React from "react";
import {
  Drawer as DrawerMui,
  makeStyles,
  List,
  ListItem,
  Link,
  Toolbar,
  Typography,
  Divider,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  drawer: {
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
}));

const drawerWidth = 240;

const Drawer = (props) => {
  const classes = useStyles();

  const renderItems = (role) => {
    switch (role) {
      case "admin":
        return [
          <ListItem>
            <Link href="/admin/dashboard">
              <Typography variant="body1">Dashboard</Typography>
            </Link>
          </ListItem>,
          <Divider />,
          <ListItem>
            <Link href="/admin/users">
              <Typography variant="body1">Usuarios</Typography>
            </Link>
          </ListItem>,
          <Divider />,
          <ListItem>
            <Link href="/admin/employees">
              <Typography variant="body1">Empleados</Typography>
            </Link>
          </ListItem>,
          <Divider />,
          <ListItem>
            <Link href="/admin/challenges">
              <Typography variant="body1">Competiciones</Typography>
            </Link>
          </ListItem>,
        ];

      case "employee":
        return [
          <ListItem>
            <Link href="/staff/users">
              <Typography variant="body1">Usuarios</Typography>
            </Link>
          </ListItem>,
          <Divider />,
          <ListItem>
            <Link href="/staff/challenges">
              <Typography variant="body1">Competiciones</Typography>
            </Link>
          </ListItem>,
        ];
        break;

      default:
        break;
    }
  };

  return (
    <DrawerMui
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>{renderItems(props.user ? props.user.role || null : null)}</List>
        <Divider />
      </div>
    </DrawerMui>
  );
};

export { Drawer };
