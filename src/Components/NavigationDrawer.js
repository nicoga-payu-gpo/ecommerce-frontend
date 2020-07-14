import React, {useEffect} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LaunchIcon from "@material-ui/icons/Launch";
import DashboardIcon from '@material-ui/icons/Dashboard';
import Button from "@material-ui/core/Button";
import Products from "./Products";
import AssignmentIcon from '@material-ui/icons/Assignment';
import BallotOutlinedIcon from '@material-ui/icons/Ballot';
import {Link, Redirect, Route, Switch, useHistory, useRouteMatch} from "react-router-dom";
import ProductsManagement from "./ProductsManagement";
import OrdersManagement from "./OrdersManagement";


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" to="/home">
                Redonez
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));

export default function Dashboard() {
    let { path, url } = useRouteMatch();
    let history = useHistory();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [userRole, setUserRole] = React.useState("");

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const logout = () => {
        localStorage.clear()
        history.push("/home");
        window.location.reload()
    };
    useEffect(() => {
        if (localStorage.getItem("accessToken") != null) {
            setLoggedIn(true);
        }
        if(localStorage.getItem("user")!=null){
            setUserRole(JSON.parse(localStorage.getItem("user")).role);
        }

    }, []);


    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    {loggedIn === true ?
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        : null
                    }
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Redonez
                    </Typography>
                    {loggedIn === false ?
                        <Button color="inherit" component={Link}
                                to={"/signIn"}>Iniciar Sesión</Button>
                        : null
                    }
                </Toolbar>
            </AppBar>
            {loggedIn === true ?
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                    }}
                    open={open}
                >
                    <div className={classes.toolbarIcon}>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </div>
                    <Divider/>
                    <List>
                        <ListItem button component={Link} to="/home">
                            <ListItemIcon>
                                <DashboardIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Productos"/>
                        </ListItem>
                        {userRole === "ROLE_ADMIN" ?
                            <>
                                <ListItem button style={{whiteSpace: 'normal'}} component={Link}
                                          to={`${url}/productsManagement`}>
                                    <ListItemIcon>
                                        <BallotOutlinedIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Administración de productos"/>
                                </ListItem>
                                <ListItem button component={Link} to={`${url}/ordersManagement`}>
                                    <ListItemIcon>
                                        <AssignmentIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Ordenes"/>
                                </ListItem>
                            </>
                            : null}
                    </List>
                    <Divider/>

                    <List>
                        <ListItem button onClick={logout} key="Logout">
                            <ListItemIcon>
                                <LaunchIcon/>
                            </ListItemIcon>
                            <ListItemText   primary="Cerrar sesión"/>
                        </ListItem>
                    </List>
                </Drawer>
                : null
            }
            <main className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <Container maxWidth="lg" className={classes.container}>
                    <Switch>
                        <Route exact path="/home" render={props => <Products/>}/>
                        <Route path={`${path}/productsManagement`} render={props => <ProductsManagement/>}/>
                        <Route path={`${path}/ordersManagement`} render={props => <OrdersManagement/>}/>
                        <Route render={() => <Redirect to="/home"/>}/>
                    </Switch>


                    <Box pt={4}>
                        <Copyright/>
                    </Box>
                </Container>
            </main>
        </div>
    );
}