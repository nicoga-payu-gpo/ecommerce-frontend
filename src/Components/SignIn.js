import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import axios from 'axios';
import {useHistory} from "react-router-dom";


/**
 * Copyright banner.
 */
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit">
                Redonez
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

/**
 * Custom theme definition.
 */
const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

/**
 * Provides the view in order to login a user in the system.
 *
 * @returns {*} Sign in view.
 */
export default function SignInSide() {

    /**
     * Styles for the view.
     */
    const classes = useStyles();

    /**
     * Router history.
     */
    let history = useHistory();

    /**
     * User to attempt the login in the system.
     */
    const [user, setUser] = React.useState({email: "", password: ""});

    /**
     * Backend API call for login the user.
     */
    function signInUser() {
        axios.post("http://localhost:8080/API/user/signIn", user).then((res) => {
            localStorage.setItem("accessToken", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            history.push("/home")
        }).catch(function (error) {
            alert("Credenciales invalidas!")
            setUser({email: "", password: ""});
        });
    }

    /**
     * Handle changes on the user to be logged in.
     *
     * @param e Event that contains the property changed of the user.
     */
    const handleChangeUser = e => {
        const {name, value} = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }))
    };

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline/>
            <Grid item xs={false} sm={4} md={7} className={classes.image}/>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Iniciar sesión
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            onChange={handleChangeUser}
                            value={user.email}
                            label="Correo electronico"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            onChange={handleChangeUser}
                            value={user.password}
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Recuerdame"
                        />
                        <Button
                            onClick={signInUser}
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Iniciar Sesión
                        </Button>
                        <Grid container>

                            <Grid item>
                                <Link href="/signUp" variant="body2">
                                    {"No tienes una cuenta? Crea cuenta"}
                                </Link>
                            </Grid>
                        </Grid>
                        <Box mt={5}>
                            <Copyright/>
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}